import _ from "lodash";

class UserClientData {

    static normalize(data) {
        const result = {
            labs: {
                taskView: {
                    displayAssignedTo: false,
                    displayCommentButton: false
                },
                navigation: {
                    viewRememberDefaultView: false
                }
            },
            presets: {
                listView: [],
                tableView: []
            },
            color: _.get(data,'color',21),
            ftue: {
                watchedVideos: []
            }
        };

        if (data) {
            if (data.labs) {
                if (data.labs.taskView) {
                    if (data.labs.taskView.displayAssignedTo) result.labs.taskView.displayAssignedTo = data.labs.taskView.displayAssignedTo;
                    if (data.labs.taskView.displayCommentButton) result.labs.taskView.displayCommentButton = data.labs.taskView.displayCommentButton;
                }

                if (data.labs.navigation) {
                    if (data.labs.navigation.viewRememberDefaultView) result.labs.navigation.viewRememberDefaultView = data.labs.navigation.viewRememberDefaultView;
                }
            }

            if (data.presets) {
                if (data.presets.listView) result.presets.listView = result.presets.listView.concat(data.presets.listView);
                if (data.presets.tableView) result.presets.tableView = result.presets.tableView.concat(data.presets.tableView);
            }

            result.ftue.watchedVideos = _.get(data, 'ftue.watchedVideos', []);
        }

        return result
    }

}


module.exports = UserClientData;