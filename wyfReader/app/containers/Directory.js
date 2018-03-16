import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, ListView, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import Util from "../utils/utils";
import { NavigationActions } from "../utils";

@connect((state) => ({
  directory: state.reader.directory
}))
class Directory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    }
    this.id = this.props.navigation.state.params.id;
    this.name = this.props.navigation.state.params.name;
  }
  componentWillMount() {
    this.props.dispatch({
      type:"reader/getDirectory",
      payload: {
        id: this.id,
        order: this.state.order
      }
    })
  }
  changeOrder() {
    if (this.state.order === 1) {
      this.setState({order: -1})
    }
    else {
      this.setState({order: 1})
    }
    this.props.dispatch({
      type:"reader/getDirectory",
      payload: {
        id: this.id,
        order: this.state.order
      }
    })
  }
  goReader(num) {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Reader', params: {id: this.id, name: this.name, num} }))
  }
  renderRow(item) {
    return(
      <TouchableOpacity
        key={item.number}
        style={[styles.item, styles.row]}
        onPress={ () => {this.goReader(item.number)}  }>
          <View style={{justifyContent: 'center',marginLeft: 10}}>
            <Text style={{color: '#B9B9B9',}}>
              {item.number + 1}.
            </Text>
          </View>
          <View style={{justifyContent: 'center',marginLeft: 10}}>
            <Text style={{color: '#282C34',}}>
              {item.title}
            </Text>
          </View>
     </TouchableOpacity>
    )
  }
  renderList(lists) {
    return(
      <ListView
           enableEmptySections
           style={styles.scrollSection}
           dataSource={this.state.dataSource.cloneWithRows(lists)}
           renderRow={this.renderRow.bind(this)} />
    )
  }
  render() {
    const lists = this.props.directory
    return (
     <View style={styles.scene}>
     <View style={styles.nav}>
       <View style={[styles.button]}>
         <TouchableOpacity
           onPress={ () => {this.props.dispatch(NavigationActions.back())}}
           style={styles.button}
           >
           <Image
             source={require('../images/back.png')}
             style={styles.leftButton} />
         </TouchableOpacity>
       </View>
       <View style={[styles.title]}>
         <Text style={styles.titleText}>{this.name}</Text>
       </View>
       <View style={[styles.button]}>
         <TouchableOpacity
           style={styles.button}
           onPress={() => {this.changeOrder()}}>
           {this.state.order === -1 ? <Image style={styles.rightImg}
             source={require(`../images/up.png`)} /> : <Image style={styles.rightImg}
               source={require(`../images/down.png`)} />}
         </TouchableOpacity>
       </View>
     </View>
     {this.renderList(lists)}
   </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  nav: {
    backgroundColor: 'rgb(52,120,246)',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    height: 66,
    justifyContent: 'center',
  },
  titleText: {
    marginTop: 25,
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
  },
  leftButton: {
    marginTop: 25,
    marginRight: 5,
  },
  item: {
    height: 60,
    borderBottomWidth: Util.pixel,
    borderColor: '#A5A5A5',
  },
  row:{
    flexDirection: 'row',
  },
  rightImg: {
    marginTop: 20
  }
})

export default Directory
