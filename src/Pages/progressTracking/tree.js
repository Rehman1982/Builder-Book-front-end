import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

const Partials = {
  //   date: (date) => {
  //     // YYYY-MM-DD
  //     let dt = new Date(date);
  //     dt = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  //     return dt;
  //     return new Date(dt);
  //   },
  //   DiffInDays_dates: (Max, Min) => {
  //     let Minn = new Date(Min);
  //     let Maxx = new Date(Max);
  //     if (Minn > Maxx) {
  //       return 0;
  //     } else {
  //       let a = new Date(
  //         `${Maxx.getFullYear()}-${Maxx.getMonth() + 1}-${Maxx.getDate()}`
  //       );
  //       let b = new Date(
  //         `${Minn.getFullYear()}-${Minn.getMonth() + 1}-${Minn.getDate()}`
  //       );
  //       return Math.round((a - b) / 86400000) + 1;
  //     }
  //   },
  MinDate: (data, startVal) => {
    const resp = data.reduce(
      (acc, item) => {
        if (dayjs(acc.start).isValid()) {
          if (dayjs(item.start).isBefore(dayjs(acc.start))) {
            acc.start = item.start;
          }
        } else {
          acc.start = dayjs(item.start);
        }
        return acc;
      },
      { start: startVal }
    );
    return resp.start;
  },
  MaxDate: (data, startVal) => {
    const resp = data.reduce(
      (acc, item) => {
        if (dayjs(acc.finish).isValid()) {
          if (dayjs(item.finish).isAfter(dayjs(acc.finish))) {
            acc.finish = dayjs(item.finish);
          }
        } else {
          acc.finish = dayjs(item.finish);
        }
        return acc;
      },
      { finish: startVal }
    );
    return resp.finish;
  },
  sumWrokDone: (dpr, upto = null) => {
    if (dpr.length > 0) {
      return dpr.reduce((total, current) => {
        if (upto == null) {
          return total + parseInt(current.work_done);
        } else {
          if (dayjs(current.created_at).isSameOrBefore(dayjs(upto))) {
            return total + parseInt(current.work_done);
            // return (total > 0) ? total : 0;
          } else {
            return total;
          }
        }
      }, 0);
    } else {
      return 0;
    }
  },
  //   DPRs: (v, data) => {
  //     let first, last, diff;
  //     if (v.dpr) {
  //       first = v.dpr.length > 0 ? Partials.date(v.dpr[0]["created_at"]) : null;
  //       last =
  //         v.dpr.length > 0
  //           ? Partials.date(v.dpr[v.dpr.length - 1]["created_at"])
  //           : "";

  //       // if (first !== "") {
  //       first = data.reduce((acc, item) => {
  //         if (acc !== null) {
  //           if (new Date(item["AchStart"]) < new Date(acc)) {
  //             acc = item["AchStart"];
  //           }
  //         } else {
  //           acc = v.AchStart;
  //         }
  //         return acc;
  //       }, v.AchStart);
  //       // }

  //       last = data.reduce((acc, item) => {
  //         if (acc !== null) {
  //           if (new Date(item["AchFinish"]) > new Date(acc)) {
  //             acc = item["AchFinish"];
  //           }
  //         } else {
  //           acc = item["AchFinish"];
  //         }

  //         return acc;
  //       }, last);

  //       diff = data.reduce(
  //         (acc, item) => acc + item["AchDiff"],
  //         Partials.DiffInDays_dates(last, first)
  //       );
  //     }
  //     return { first, last, diff };
  //   },
  //   getProjects: () => {
  //     const url = "progressTracking.index";
  //     fetch(url, { type: "projects" })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.success) {
  //           setProjects(data.data.projects);
  //           // setIndex(data.data.index);
  //         }
  //       });
  //   },
};

export const makeTree = (data, id = null) => {
  return data
    .map((item) => {
      if (item.parent_id !== id) return;

      const children = makeTree(data, item.id);
      const start = dayjs(Partials.MinDate(children, item.start));
      const finish = dayjs(Partials.MaxDate(children, item.finish));

      const baseBudget = parseInt(item.budget || 0);
      const childBudget = children.reduce(
        (acc, c) => acc + parseInt(c.budget || 0),
        0
      );
      const budget = baseBudget + childBudget;

      const totalWrokDone = Partials.sumWrokDone(item.dpr);
      let wdAmount = parseInt((budget * totalWrokDone) / 100);
      wdAmount += children.reduce(
        (acc, c) => acc + parseInt(c.wdAmount || 0),
        0
      );

      const total_days_req = finish.diff(start, "day") + 1;
      const per_day_budget = budget / total_days_req;

      const today = dayjs().isAfter(finish) ? finish : dayjs();
      const days_elapsed = today.diff(start, "day") + 1;
      const planedBudget = Math.round(per_day_budget * days_elapsed);

      const dpr = item.dpr || [];
      const AchStart = dpr.length ? dayjs(dpr[0].created_at) : null;
      const AchFinish = dpr.length
        ? dayjs(dpr[dpr.length - 1].created_at)
        : null;
      const AchDiff =
        AchStart && AchFinish ? AchFinish.diff(AchStart, "day") + 1 : 0;

      const lag = Math.round(((planedBudget - wdAmount) / (budget || 1)) * 100);
      const totalWrokDonePercent =
        budget > 0 ? parseInt((wdAmount / budget) * 100) : 0;

      return {
        ...item,
        start: start.format("YYYY-MM-DD"),
        finish: finish.format("YYYY-MM-DD"),
        budget,
        totalWrokDone: totalWrokDonePercent,
        wdAmount,
        childs: children,
        total_days_req,
        planedBudget,
        AchStart: AchStart?.format("YYYY-MM-DD") || "",
        AchFinish: AchFinish?.format("YYYY-MM-DD") || null,
        AchDiff,
        lag,
      };
    })
    .filter(Boolean);
};
