import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    StyleProvider, Container, Title, Content,
    Body, Left, Right,
    Icon, Text, Button,
    Input, ListItem, List, Form, View
} from 'native-base';
import FeatherIcon from 'react-native-vector-icons/FontAwesome'
import getTheme from '../../../app-theme/components'
import theme from '../../../app-theme/variables/platform';
import ColorHeader from '../../../components/color-header';
import withNavigation from 'react-navigation/src/views/withNavigation';
import { updateCustomFields } from '../../../redux/actions/task';
import { getGlyphByType } from '../../../common/task-type-icons';

const AmountArray = [
    { name: "us_dollar", value: "$" },
    { name: "euro", value: "€" },
    { name: "pound_sterling", value: "£" },
    { name: "australian_dollar", value: "$" },
    { name: "arab_emirates_dirham", value: "dh" },
    { name: "Argentine_Peso", value: "$" },
    { name: "Brazilian_Real", value: "R$" },
    { name: "Canadian_Dollar", value: "$" },
    { name: "Chilean_Peso", value: "$" },
    { name: "Colombian_Peso", value: "$" },
    { name: "Czech_Koruna", value: "Kč" },
    { name: "Danish_Krone", value: "kr" },
    { name: "Hong_Kong_Dollar", value: "HK$" },
    { name: "Hungarian_Forint", value: "Ft" },
    { name: "Indian_Rupee", value: "₹" },
    { name: "Indonesian_Rupiah", value: "Rp" },
    { name: "Israeli_New_Shekel", value: "₪" },
    { name: "Japanese_Yen", value: "¥" },
    { name: "Korean_Won", value: "₩" },
    { name: "Malaysian_Ringgit", value: "RM" },
    { name: "Mexican_Peso", value: "$" },
    { name: "New_Zealand_Dollar", value: "$" },
    { name: "Norwegian_Krone", value: "kr" },
    { name: "Peruvian_Nuevo_Sol", value: "S /." },
    { name: "Philippine_Peso", value: "₱" },
    { name: "Polish_Zloty", value: "zł" },
    { name: "Romanian_New_Leu", value: "lei" },
    { name: "Russian_Ruble", value: "руб." },
    { name: "Saudi_Riyal", value: "Rial" },
    { name: "Singapore_Dollar", value: "$" },
    { name: "South_African_Rand", value: "R" },
    { name: "Swedish_Krona", value: "kr" },
    { name: "Swiss_Franc", value: "CHF" },
    { name: "Taiwan_Dollar", value: "NT$" },
    { name: "Thai_Baht", value: "฿" },
    { name: "Turkish_Lira", value: "TRY" },
    { name: "Ukraine_Hryvnia", value: "₴" },
    { name: "Vietnamese_Dong", value: "₫" },
    { name: "Yuan_Renminbi", value: "¥" },
]
export class AmountField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: ''
        }
    }
    saveAmount = () => {
        const task = this.props.navigation.getParam('propsData')
        const type = this.props.navigation.getParam('type')
        const { amount } = this.state
        const id = this.props.navigation.getParam('id')

        this.props.updateCustomFields(task, id, amount, type)
        this.props.navigation.goBack()
    }
    componentDidMount() {
        const value = this.props.navigation.getParam('value')
        this.setState({
            amount: value && value.toString()
        })
    }

    render() {
        const { navigation } = this.props
        const task = this.props.navigation.getParam('propsData')
        const project = gd.session.projects.get(task.projectId);
        const headerBg = '#' + gd.const.project.color[project.color];
        const symbol = this.props.navigation.getParam('symbol')
        console.log(symbol)
        const result = AmountArray.find(({ name }) => (name).toLowerCase() === symbol);
        console.log(result)
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
                        </Right>
                    </ColorHeader>
                    <Content style={MainHeader}>
                        <ListItem style={{ paddingLeft: 15 }}>
                            <Text>{result.value}</Text>
                            <Input
                                onChangeText={(text) => this.setState({ amount: text })}
                                value={this.state.amount}
                                placeholder='Enter Amount'
                                keyboardType={'numeric'}
                                style={{ paddingLeft: 10 }}
                            />
                        </ListItem>
                        <ListItem ></ListItem>
                        <View style={buttonStyle}>
                            <Button onPress={() => this.saveAmount()} primary block>
                                <Text>Save</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}
const MainHeader = {
    width: '100%',
    alignSelf: 'center',
}
const buttonStyle = {
    width: '90%',
    alignSelf: 'center',
}

function mapStateToProps(state) {
    console.log(state)
    return {
        task: state.task,
    }
}
export default withNavigation(connect(mapStateToProps, {
    updateCustomFields
})(AmountField))






// <Text style={styles.text}> Doller = {'\u0024'} </Text>

//  <Text style={styles.text}> Rupees = {'\u20B9'} </Text>

//  <Text style={styles.text}> Euro =  {'\u20AC'} </Text>

//  <Text style={styles.text}> Japanese yen = {'\u00A5'} </Text>

//  <Text style={styles.text}> Pound sterling = {'\u00A3'} </Text>