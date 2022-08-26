import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    StyleProvider, Container, Title, Content,
    Body, Left, Right, Icon, Text, Button, Item
} from 'native-base';
import { Rating } from 'react-native-elements';
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import { updateCustomFields } from '../../../redux/actions/task';
import StarRating from 'react-native-star-rating';
export class ratings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratingValue: ''
        }
    }
    setRatingsValue = async (value) => {
        await this.setState({
            ratingValue: value
        })
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')

        const { ratingValue } = this.state
        const id = this.props.navigation.getParam('id')
        this.props.updateCustomFields(task, id, ratingValue, type)
        this.props.navigation.goBack()
    }
    saveAmount = () => {

    }
    renderRatings = () => {
        const ratingsType = this.props.navigation.getParam('ratingsType')
        if (ratingsType === 5) {
            return <Content>
                <Item onPress={() => this.setRatingsValue(5)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={5}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(4)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={4}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(3)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={3}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(2)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={2}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(1)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={1}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(0)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={0}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(null)} style={starContainer}>
                    <Text style={{ marginHorizontal: 7 }}>No Rating</Text>
                </Item>
            </Content>
        }
        else {
            return <Content>
                <Item onPress={() => this.setRatingsValue(3)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={3}
                        rating={3}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(2)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={3}
                        rating={2}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(1)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={3}
                        rating={1}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(0)} style={starContainer}>
                    <StarRating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        iconSet={'FontAwesome'}
                        maxStars={3}
                        rating={0}
                        fullStarColor={'#F2B953'}
                        starStyle={{ marginHorizontal: 7, }}
                        starSize={25}
                        emptyStarColor={'#D3D2D7'}
                    />
                </Item>
                <Item onPress={() => this.setRatingsValue(null)} style={starContainer}>
                    <Text style={{ marginHorizontal: 7 }}>No Rating</Text>
                </Item>
            </Content>
        }
    }
    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        return (
            <StyleProvider style={getTheme(theme)}>
                <Container>
                    <ColorHeader noShadow noBottomBorder style={{ backgroundColor: headerBg }}>
                        <Left>
                            <Button transparent onPress={() => navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title ellipsizeMode="head">{'Custom Field Name'}</Title>
                        </Body>
                        <Right>
                            {/* <Button transparent onPress={this.handleRefresh}>
                                <Icon name="refresh" {...iconPropsAdd} />
                            </Button> */}
                        </Right>
                    </ColorHeader>
                    {this.renderRatings()}
                </Container>
            </StyleProvider>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}
const starContainer = {
    paddingVertical: 12,
    paddingHorizontal: 10
}
export default connect(null, { updateCustomFields })(ratings)
