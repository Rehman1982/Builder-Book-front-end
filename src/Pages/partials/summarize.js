
import Partials from "../progressTracking/Partials";
const summarize = (staticData, Dynamicdata, id = null) => {
    let d = Dynamicdata.map((v, i) => {
        if (v.parent_id == id) {
            let data = summarize(staticData, Dynamicdata, v.id);
            // Journals values
            // Planed
            v.start = Partials.MinDate(data, v.start);
            v.finish = Partials.MaxDate(data, v.finish);
            v.budget = data.reduce((acc, item) => acc + parseInt(item.budget), parseInt(v.budget));
            // Achieved
            v["totalWrokDone"] = Partials.sumWrokDone(v.dpr); // workdone in Percentaget
            v["wdAmount"] = parseInt(v.budget * v["totalWrokDone"] / 100); // work done in Rupees
            v.wdAmount = data.reduce((acc, item) => acc + parseInt(item.wdAmount), parseInt(v.wdAmount));
            // v["childs"] = data;
            v.budget > 0 ? v["totalWrokDone"] = parseInt(v.wdAmount / v.budget * 100) : "";
            let total_days_req = Partials.DiffInDays_dates(v.finish, v.start);
            v["total_days_req"] = total_days_req;
            let per_day_planed_budget = v.budget / total_days_req; // 357 Per day
            // today - start = 5;
            let Today = new Date() > new Date(v.finish) ? new Date(v.finish) : new Date();
            let days_elapsed = Partials.DiffInDays_dates(Today, v.start);
            let planed_value_todate = Math.round(parseInt(per_day_planed_budget * days_elapsed)); // 1785
            v["planedBudget"] = planed_value_todate;
            let Budget = v.budget == 0 ? 1 : v.budget;
            v["lag"] = Math.round(parseInt(planed_value_todate - v.wdAmount) / Budget * 100);
            return v;
        }
    });
    return d.filter(a => a !== undefined);
}
export default summarize;
