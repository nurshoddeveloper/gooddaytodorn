const React = require('react');
//const { PropTypes } = require('react');
//const Classes = require('classnames');
import _ from 'lodash';
import {
    Text,
    ListItem, Left, Body
} from 'native-base';
import { getGlyphByName } from '../../../../../../src_native/common/icons';

class ProjectItem  extends React.PureComponent {

    /*propTypes: {
        project: PropTypes.object,
        counter: PropTypes.number,
        selectable: PropTypes.bool,
        expandable: PropTypes.bool,
        isSelected: PropTypes.bool,
        isExpanded: PropTypes.bool,
        isSelectInherited: PropTypes.bool,
        multiselect: PropTypes.bool,
        level: PropTypes.number,
        showProjectIcon: PropTypes.bool,
        disabled: PropTypes.bool,

        onClick: PropTypes.func,
        onToggleExpand: PropTypes.func
    }*/

    /*getDefaultProps() {
        return {
            selectable: true,
            expandable: true,
            isExpanded: false,
            multiselect: false,
            level: 0
        }
    }*/

    static defaultProps = {
      selectable: true,
      expandable: true,
      isExpanded: false,
      multiselect: false,
      level: 0
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onArrowClick = this.onArrowClick.bind(this);
    }

    onClick(e) {
        //e.stopPropagation();
        const { project, onClick } = this.props;
        if (onClick) onClick(project);
    }

    onArrowClick(e) {
        //e.stopPropagation();
        const { project, onToggleExpand } = this.props;
        if (onToggleExpand) onToggleExpand("p_"+project.id);
    }

    renderProjectIcon(){
        let projectIcon;
        if (this.props.showProjectIcon) {
            const projectIconClasses = Classes(
                "gd-tree-item-icon",
                gd.const.project.typeIcon[this.props.project.systemType]
            );
            projectIcon = <div className={projectIconClasses}> </div>
        }

        return projectIcon;
    }

    renderMultiselectCheckbox(){
        const { multiselect, selectable } = this.props;
        return (multiselect && selectable) && <div className="check-box gd-icon-ok"> </div>;
    }

    renderCounter(){
        const { counter } = this.props;
        return counter !== null && <div className="gd-tree-item-counter">{counter}</div>;
    }

    renderWeb() {
        const { project, counter, selectable, expandable, isExpanded, level, disabled, isSelected, isSelectInherited } = this.props;

        const classes = Classes("gd-tree-item-project", "level-"+level, {
            'gd-tree-item-selected': isSelected,
            'gd-tree-item-select-inherited': isSelectInherited,
            "with-counter": counter !== null,
            'is-disabled': disabled,
            'not-selectable': !selectable
        });

        const arrowClasses = Classes('gd-tree-item-arrow-icon',{
            "hidden": !expandable,
            "gd-icon-arrow-down": isExpanded,
            "gd-icon-arrow-right": !isExpanded
        });

        return (
            <div className={classes} onClick={disabled || !selectable ? null : this.onClick}>
                {this.renderMultiselectCheckbox()}
                <div className={arrowClasses} onClick={this.onArrowClick}> </div>
                <div className="gd-tree-item-name">{this.renderProjectIcon()}{project.name}</div>
                {this.renderCounter()}
            </div>
        );
    }

    render() {
      const { project, counter, selectable, expandable, isExpanded, level, disabled, isSelected, isSelectInherited, showProjectIcon } = this.props;

      const arrWidth = 40 + 40*level;
      let arrow = <Text glisp-icon-arrow hidden style={{width:arrWidth}}></Text>;
      if (expandable) {
        const glyph = String.fromCharCode(getGlyphByName(isExpanded ? 'arrow-down' : 'arrow-right'));
        arrow = <Text glisp-icon-arrow style={{width:arrWidth}} onPress={this.onArrowClick}>{glyph}</Text>;
      }
      let icon = null;
      if (showProjectIcon) {
        const glyph = String.fromCharCode(getGlyphByName(gd.const.project.typeIcon[project.systemType]));
        icon = <Text gd-icon glisp-project-icon>{glyph}</Text>;
      }

      const onClick = disabled || !selectable ? null : this.onClick;
      const pnAdd = {};
      if (isSelected) pnAdd['glisp-project-name-selected'] = true;

      const projectName = _.trim(project.name);

      return (
        <ListItem gd-list-item-select-project glisp-project onPress={onClick}>
          <Left>
            {arrow}
          </Left>
          <Body>
            {icon}
            <Text glisp-project-name {...pnAdd} numberOfLines={2}>{projectName}</Text>
          </Body>
        </ListItem>
      );
    }
}

module.exports = ProjectItem;