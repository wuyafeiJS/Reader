import React, { PureComponent } from 'react'
import { 
  PixelRatio,
  ScrollView,
  View,
  Image,
  Text,
  ListView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TouchableWithoutFeedback
} from 'react-native'
import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import { NavigationActions, createAction } from '../utils'


@connect(({ app }) => ({ app }))
class Home extends PureComponent {
  static navigationOptions = {
    title: 'wyfReader',
    tabBarLabel: 'Book',
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/tabbar1.png')}
      />,
  }
  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      loaded: 0,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
    // this.closeSwipeout = this.closeSwipeout.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }
  componentWillMount() {

    this.props.dispatch(createAction('app/getBookList')())
  }
  closeSwipeout = () => {
    
  }
  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Search' }))
  }
  _onRefresh= () => {
    this.setState({isRefreshing: true})
    this.props.dispatch({ type: 'app/getBookList', payload: {} }).then(() => {
      this.setState({
        loaded: this.state.loaded + 10,
        isRefreshing: false,
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        })
      })
    })
    
  }
  renderRow(list, index, length) {
    const that = this
    const swipeoutBtns = [
      {
        text: '删除',
        onPress: () => {that.delectNovel(list._id)}
      }
    ]
    let conStyle = [styles.item, styles.row]
    if (index * 1 === length - 1) {
      conStyle = [styles.item, styles.row, styles.rmLine]
    }
    return (
      <Swipeout
      refs='Swipeout'
      rowID={list._id}
      right={swipeoutBtns}
      autoClose={true}
      backgroundColor={'#ffffff'}>
        <TouchableOpacity
           onPress={ () => this.props.dispatch(NavigationActions.navigate({ routeName: 'Reader', params: {id: list.novel._id, name: list.novel.name, num: list.number} })) }
           style={conStyle}>
          <View style={styles.left}>
            {/* <Image style={styles.img} source={{uri: list.novel.img}} resizeMode="contain" /> */}
            <Image style={styles.img} source={{uri:list.novel.img}} resizeMode="contain" />
          </View>
          <View >
            <Text style={styles.novelTitle}>{list.novel.name}</Text>
            <Text style={styles.text}>最新: {list.novel.lastChapterTitle}</Text>
            <View style={styles.row}>
              <Image style={styles.clock} source={require('../images/clock.png')} resizeMode="contain" />
              <Text style={styles.duration}>{list.novel.updateTime}</Text>
            </View>
          </View>
          {/* <View>
            <Text>ssssss</Text>
          </View> */}
        </TouchableOpacity>
      </Swipeout>
    )
  }
  renderBookList = (lists) => (
      <ScrollView
        style={styles.scrollview}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
          />
        }>
        <TouchableOpacity
          style={styles.scrollSection}
          onPress={this.closeSwipeout}>
          <ListView
              enableEmptySections
              dataSource={this.state.dataSource.cloneWithRows(lists)}
              renderRow={(rowData, sectionid, rowId) => this.renderRow(rowData, rowId, lists.length)} />
        </TouchableOpacity>
      </ScrollView>
    )
  
  render() {
    const { bookList } = this.props.app
    // const bookList = [{
    //   _id: 1111,
    //   novel: {
    //     _id: 1234,
    //     img: require('../images/test.jpg'),
    //     name: '永夜君王',
    //     lastChapterTitle: 'hahah',
    //     updateTime: '2017-12-12'
    //   }
    // }]
    if (!bookList) return <View><Text>加载中。。。</Text></View>
    return (
      <View style={styles.scene}>
      <View style={styles.nav}>
        <View style={[styles.button]}>
          <TouchableOpacity style={styles.button} />
        </View>
        <View style={[styles.title]}>
          <Text style={styles.titleText}>wyfReader</Text>
        </View>
        <View style={[styles.button]}>
          <TouchableOpacity
            style={styles.button}
            onPress={ () => this.gotoDetail() }>
            <Image source={require('../images/search.png')} style={styles.rightButton} />
          </TouchableOpacity>
        </View>
      </View>
      {bookList.length === 0?<View><Text style={styles.noDataTxt}>没有数据</Text></View>:this.renderBookList(bookList)}
    </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  noDataTxt: {
    textAlign: 'center',
    marginTop: 23
  },
  scrollSection: {
    flex: 1,
    marginTop: 0
  },
  rightButton: {
    marginTop: 25,
    marginRight: 5,
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    backgroundColor: 'rgb(52,120,246)',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99
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
  btnText: {
    fontSize: 16,
    marginRight: 10,
    color: '#ffffff',
  },
  item: {
    height: 92,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 2 / PixelRatio.get(),
    borderColor: '#ddd',
  },
  rmLine: {
    borderColor: 'transparent',
  },
  row:{
    flexDirection: 'row',
  },
  left: {
    marginTop: 10
  },
  img:{
    height: 70,
    width:90,
  },
  text:{
    color: '#A5A5A5',
    marginTop: 6,
    fontSize: 12,
  },
  clock: {
    marginTop: 8,
  },
  duration: {
    marginLeft: 4,
    color: '#A5A5A5',
    marginTop: 9  ,
    fontSize: 12,
  },
  novelTitle:{
    fontSize:16,
    marginTop: 10,
  },
})

export default Home
