import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, Button, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from '../utils'

@connect()
class Account extends Component {
  static navigationOptions = {
    title: 'Account',
    tabBarLabel: 'Account',
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/person.png')}
      />,
  }
  constructor(props) {
    super(props)
    this.state = {
      username: null
    }
  }
  componentWillMount() {
    let that = this
    AsyncStorage.getItem('username').then((username) => {
      that.setState({
        username
      })
    })
  }
  gotoLogin = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
  }
  loginout = () => {
    AsyncStorage.removeItem('username');
    AsyncStorage.removeItem('userToken');
    this.props.dispatch({type: 'app/receiveToken', payload:{token: ''}})
    this.props.dispatch({type: 'app/getBookList', payload:{}})
    this.setState({
      username: null
    })
  }
  render() {
    console.log(this.state.username,888)
    return (
      <View style={styles.container}>
        {this.state.username ? <View><Text>欢迎你，{this.state.username}</Text><Button title="退出" onPress={this.loginout} /></View> :<Button title="Goto Login" onPress={this.gotoLogin} />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
})

export default Account
