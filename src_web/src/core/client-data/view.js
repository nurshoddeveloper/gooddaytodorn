class ViewClientData {

    static normalize(data) {
        const result = {
            presets: {
                listView: [],
                tableView: [],
            }
        };

        if (data && data.presets) {
            if (data.presets.listView) result.presets.listView = result.presets.listView.concat(data.presets.listView);
            if (data.presets.tableView) result.presets.tableView = result.presets.tableView.concat(data.presets.tableView);
        }

        return result
    }
}

module.exports = ViewClientData;