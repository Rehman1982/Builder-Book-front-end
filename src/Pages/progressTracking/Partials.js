const Partials = {
    date: (date) => {
        // YYYY-MM-DD
        let dt = new Date(date);
        dt = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
        return dt;
        return new Date(dt);
    },
    DiffInDays_dates: (Max, Min) => {
        let Minn = new Date(Min);
        let Maxx = new Date(Max);
        if (Minn > Maxx) {
            return 0;
        } else {
            let a = new Date(`${Maxx.getFullYear()}-${Maxx.getMonth() + 1}-${Maxx.getDate()}`);
            let b = new Date(`${Minn.getFullYear()}-${Minn.getMonth() + 1}-${Minn.getDate()}`);
            return Math.round((a - b) / 86400000) + 1;
        }
    },
    MinDate: (data, startVal) => {
        const resp = data.reduce((acc, item) => {
            if (acc.start !== null) {
                if (new Date(item.start) < new Date(acc.start)) {
                    acc.start = item.start;
                }
            } else {
                acc.start = item.start;
            }
            return acc;

        }, { start: startVal });
        return resp.start;
    },
    MaxDate: (data, startVal) => {
        const resp = data.reduce((acc, item) => {
            if (acc.finish !== null) {
                if (new Date(item.finish) > new Date(acc.finish)) {
                    acc.finish = item.finish;
                }
            } else {
                acc.finish = item.finish;
            }
            return acc;

        }, { finish: startVal });
        return resp.finish;
    },
    sumWrokDone: (dpr) => {
        if (dpr.length > 0) {
            return dpr.reduce((total, current) => total + parseInt(current.work_done), 0);
        } else {
            return 0;
        }
    },
    // DPRs: (v, data) => {
    //     let first, last, diff;
    //     if (v.dpr) {
    //         first = v.dpr.length > 0 ? Partials.date(v.dpr[0]["created_at"]) : null;
    //         last = v.dpr.length > 0 ? Partials.date(v.dpr[v.dpr.length - 1]["created_at"]) : "";

    //         // if (first !== "") {
    //         first = data.reduce((acc, item) => {
    //             if (acc !== null) {
    //                 if (new Date(item["AchStart"]) < new Date(acc)) {
    //                     acc = item["AchStart"];
    //                 }
    //             }
    //             else {
    //                 acc = v.AchStart;
    //             }
    //             return acc;
    //         }, v.AchStart);
    //         // }

    //         last = data.reduce((acc, item) => {
    //             if (acc !== null) {
    //                 if (new Date(item["AchFinish"]) > new Date(acc)) {
    //                     acc = item["AchFinish"];
    //                 }
    //             }
    //             else {
    //                 acc = item["AchFinish"];
    //             }

    //             return acc;
    //         }, last);

    //         diff = data.reduce((acc, item) => acc + item["AchDiff"], Partials.DiffInDays_dates(last, first));
    //     }
    //     return { first, last, diff };
    // },
}

export default Partials;
