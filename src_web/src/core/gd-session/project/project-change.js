import ProjectPropertiesData from "../../client-data/project-properties";

import EventActionProto from '../event-action-proto';
const SessionLoader = require('../../../../src_web_changed/core/gd/data/session-loader');

module.exports = class EventProjectChange extends EventActionProto {

    constructor(uid, data) {
        const restartApps = [];
        super(uid, data,restartApps);
    }

    validate() {
        return true;
    }

    process() {
        const pinId = gd.session.pins.getPinId({projectId:this.data.id});
        if (pinId) {
            const pin = gd.session.pins.get(pinId);
            pin.project.name = this.data.name;
            pin.project.color = this.data.color;
            pin.project.systemType = this.data.systemType;
        }

        const sessionTemplate = gd.session.templatesList.get(this.data.id);

        if (sessionTemplate) {
            sessionTemplate.set({
                name:                   this.data.name,
                color:                  this.data.color,
                icon:                   this.data.icon,
                systemStatus:           this.data.systemStatus,
                systemType:             this.data.systemType,
                parentId:               this.data.parentId,
                shortName:              this.data.shortName,
                statusId:               this.data.statusId,
                customFields:           this.data.customFields,
                taskTypes:              this.data.taskTypes,
                projectTypeId:          this.data.projectTypeId,
                defaultView:            this.data.defaultView,
                properties:             ProjectPropertiesData.normalize(this.data.properties),
                taskStatusesOverride:   this.data.taskStatusesOverride,
                sharedTemplateId:       this.data.sharedTemplateId,
                templateContent:        this.data.templateContent,
                statuses:               this.data.statuses,
                projectIcon:            this.data.projectIcon,
                description:            this.data.description,
                isDeleted:              this.data.isDeleted
            },{silent:true, parse:true});
            sessionTemplate.trigger("change", sessionTemplate);
        }

        const sessionProject = gd.session.projects.get(this.data.id);

        if (sessionProject) {
            sessionProject.set({
                name:                   this.data.name,
                color:                  this.data.color,
                icon:                   this.data.icon,
                systemStatus:           this.data.systemStatus,
                systemType:             this.data.systemType,
                parentId:               this.data.parentId,
                shortName:              this.data.shortName,
                statusId:               this.data.statusId,
                customFields:           this.data.customFields,
                taskTypes:              this.data.taskTypes,
                projectTypeId:          this.data.projectTypeId,
                defaultView:            this.data.defaultView,
                properties:             ProjectPropertiesData.normalize(this.data.properties),
                taskStatusesOverride:   this.data.taskStatusesOverride,
                localTemplateId:        this.data.localTemplateId,
                templateContent:        this.data.templateContent,
                statuses:               this.data.statuses,
                projectIcon:            this.data.projectIcon,
                description:            this.data.description,
                isDeleted:              this.data.isDeleted
            },{silent:true, parse:true});
            sessionProject.trigger("change", sessionProject);

            super.process();

            let statuses = this.data.taskStatusesOverride ? this.data.taskStatusesOverride : [];

            let sessionLoader = new SessionLoader();
            sessionLoader.process(gd.session.findMissing({
                projects: [this.data.localTemplateId],
                statuses: statuses
            }));

            sessionLoader.done(()=>{
                // let's recreate the tree ?
                gd.tree.resetCompanyProjects(sessionProject.companyId);
            })
        }
    }
};