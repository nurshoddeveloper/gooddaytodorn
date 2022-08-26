const React = require('react');
//const { PropTypes } = require('react');
//const Classes = require('classnames');
import {
    View, Text, Button,
    ListItem, Left, Body
} from 'native-base';
import { getGlyphByName } from '../../../../../../src_native/common/icons';

class CompanyItem extends  React.PureComponent {

    /*propTypes: {
        company: PropTypes.object,
        counter: PropTypes.number,
        expandable: PropTypes.bool,
        isExpanded: PropTypes.bool,
        multiselect: PropTypes.bool,

        onClick: PropTypes.func,
        onToggleExpand: PropTypes.func
    }*/

    /*getDefaultProps() {
        return {
            expandable: true,
            isExpanded: false,
            multiselect: false,
            level: 0
        }
    }*/

    static defaultProps = {
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
        const { company, onClick } = this.props;
        if (onClick) onClick(company.id);
    }

    onArrowClick(e) {
        //e.stopPropagation();
        const { company, onToggleExpand } = this.props;
        if (onToggleExpand) onToggleExpand("c_"+company.id);
    }

    renderCounter(){
        const { counter } = this.props;
        return counter !== null && <div className="gd-tree-item-counter">{counter}</div>;
    }

    renderWeb() {
        const { company, counter, expandable, isExpanded, multiselect, isSelected, className } = this.props;

        const classes = Classes("gd-tree-item-company", className, {
            'gd-tree-item-selected': isSelected,
            "with-counter": counter !== null,
        });
        
        const arrowClasses = Classes('gd-tree-item-arrow-icon',{
            "hidden": !expandable,
            "gd-icon-arrow-down": isExpanded,
            "gd-icon-arrow-right": !isExpanded
        });

        return (
            <div className={classes} onClick={this.onClick}>
                {multiselect && <div className="check-box gd-icon-ok"> </div>}
                <div className={arrowClasses} onClick={this.onArrowClick}> </div>
                <div className="gd-tree-item-name">{company.name}</div>
                {this.renderCounter()}
            </div>
        );
    }

    render() {
      const { company, counter, expandable, isExpanded, multiselect, isSelected } = this.props;
      let arrow = <Text gd-icon-arrow hidden></Text>;
      if (expandable) {
        const glyph = String.fromCharCode(getGlyphByName(isExpanded ? 'arrow-down' : 'arrow-right'));
        arrow = <Text glisp-icon-arrow onPress={this.onArrowClick}>{glyph}</Text>;
      }
      return (
        <ListItem gd-list-item-select-project glisp-company>
          <Left>
            {arrow}
          </Left>
          <Body>
            <Text onPress={this.onClick}>{company.name}</Text>
          </Body>
        </ListItem>
      );
    }
}

module.exports = CompanyItem;