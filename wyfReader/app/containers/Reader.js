import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  Easing,
  ScrollView,
  Text,
  StyleSheet,
  ListView,
  TouchableOpacity,
  Animated,
  AsyncStorage
} from "react-native";
import { Toast } from "antd-mobile";
import { NavigationActions } from "../utils";
import Util from "../utils/utils";
import Request from "../services/app";

const tabWidth = Util.size.width;

class Reader extends Component {
  static nbsp2Space(str) {
    if (!str) {
      return null;
    }
    return str.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "        ");
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      searching: true,
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0),
      hide: true,
      chapterProgress: 0
    };
    this.uuid = this.props.navigation.state.params.id;
    this.num = this.props.navigation.state.params.num;
    this.count = 0;
    this.number = 0;
    this.prog = 0;
  }
  componentWillMount() {
    this.props
      .dispatch({
        type: "reader/getFirstRenderChapters",
        payload: {
          id: this.uuid,
          num: this.num
        }
      })
      .then(() => {
        const { firstChapter } = this.props;
        if (firstChapter) {
          this.handleData(firstChapter);
        }
      });
  }

  getContent(chapterInfo) {
    const content = chapterInfo.content;
    let arr = [];
    let _content = this.constructor.nbsp2Space(content);
    let _arr = Util.handleContent(_content);
    this.currentChapter = this.nextChapter;
    this.nextChapter = _arr.length;
    _arr.forEach(_item => {
      let _chapterInfo = {
        title: chapterInfo.title,
        num: chapterInfo.number,
        content: _item
      };
      arr.push(_chapterInfo);
    });
    return arr;
  }

  handleData(firstChapter) {
    let progress = firstChapter.progress;
    this.number = firstChapter.chapters[0].number;
    const lists = firstChapter.chapters;
    this.totals = firstChapter.countChapter;
    let content = this.constructor.nbsp2Space(lists[0].content);
    let arr = [];
    content = content.replace(/\s{8}/, "");
    let _arr = Util.handleContent(content);

    this.currentChapter = _arr.length;
    _arr.forEach(_item => {
      // let item = _item.map(v => v.replace(/\r/, ''))
      let chapterInfo = {
        title: lists[0].title,
        num: lists[0].number,
        content: _item
      };
      arr.push(chapterInfo);
    });
    if (lists.length === 2) {
      content = this.constructor.nbsp2Space(lists[1].content);
      _arr = Util.handleContent(content);
      this.nextChapter = _arr.length;
      _arr.forEach(_item => {
        let chapterInfo = {
          title: lists[1].title,
          num: lists[1].number,
          content: _item
        };
        arr.push(chapterInfo);
      });
    }
    this._data = arr;
    this.setState({
      searching: false
    });
    let scrollView = this.refs.scrollView;
    scrollView.scrollTo({ x: progress * 375, y: 0, animated: false });
  }
  loading() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            height: Util.size.height,
            width: tabWidth,
            alignItems: "center",
            marginTop: 200
          }}
          activeOpacity={1}
          onPress={() => {
            this.show();
          }}
        >
          <Text>加载中。。。</Text>
        </TouchableOpacity>
      </View>
    );
  }

  show() {
    if (this.state.hide) {
      this.setState({ hide: false }, this.in);
    }
  }
  //显示动画
  in() {
    Animated.parallel([
      Animated.timing(this.state.offset, {
        easing: Easing.linear,
        duration: 200,
        toValue: 1
      })
    ]).start();
  }

  //隐藏动画
  out() {
    Animated.parallel([
      Animated.timing(this.state.offset, {
        easing: Easing.linear,
        duration: 200,
        toValue: 0
      })
    ]).start(finished => this.setState({ hide: true }));
  }
  //取消
  iknow() {
    if (!this.state.hide) {
      this.out();
    }
  }
  showReaderOptions() {
    return (
      <View style={styles.alertContainer}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.state.offset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-70, 0]
                })
              }
            ]
          }}
        >
          <TouchableOpacity
            style={styles.alertTop}
            onPress={() => {
              this.props.dispatch(NavigationActions.back());
            }}
          >
            <Image
              style={styles.backImg}
              source={require("../images/back.png")}
            />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={{ height: Util.size.height - 140 }}
          onPress={this.iknow.bind(this)}
        />
        <Animated.View
          style={[
            styles.alertFoot,
            {
              transform: [
                {
                  translateY: this.state.offset.interpolate({
                    inputRange: [0, 1],
                    outputRange: [70, 0]
                  })
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              this.goDerictory();
            }}
          >
            <Image
              style={styles.directoryImg}
              source={require("../images/directory.png")}
            />
            <Text style={styles.directoryText}>目录</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
  _concatData(newData) {
    this._data = this._data.concat(newData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data)
    });
  }
  _unshiftData(newData) {
    const that = this
    newData = newData.concat(this._data)
    this._data = newData
    setTimeout(() => {
      that.setState({
        dataSource: that.state.dataSource.cloneWithRows(that._data),
        searching: false
      })
    }, 300);
  }
  handleScroll(e) {
    let arr = [];
    let chapterInfo;
    let listView = this.refs.listView;
    let x = e.nativeEvent.contentOffset.x;
   
    let abs = Math.abs(x - this.x) || 0
    if (abs > 300) {
      this.prog ++
    }
    console.log(this.currentChapter)
    if (this.count === 0) {
      this.count = (this.currentChapter - 1) * 375;
    }

    this.x = x;
    if (this.prog > (this.currentChapter - 1)) {
      this.prog = 0
    }
    this.setState({
      chapterProgress: parseInt(this.prog / (this.currentChapter - 1) * 100)
    });
    
    if (x > this.count) {
      this.prog = 0;
      this.a = this.count;
      this.count += this.nextChapter * 375;
      if (this.number + 2 < parseInt(this.props.firstChapter.countChapter)) {
        this.props
          .dispatch({
            type: "reader/getChapters",
            payload: {
              id: this.uuid,
              num: this.number + 2
            }
          })
          .then(() => {
            const { chapter } = this.props;
            if (chapter) {
              this.number = this.number + 1;
              const _arr = this.getContent(chapter);
              this._concatData(_arr);
            }
          });
      } else {
        this.a = 0;
      }
    }
    
    if (x < 0 && this.number === 0) {
      alert("已是第一页");
    }

    if (x < 0) {
      this.i = 1;
      this.props
        .dispatch({
          type: "reader/getChapters",
          payload: {
            id: this.uuid,
            num: this.number - 1
          }
        })
        .then(() => {
          const { chapter } = this.props;
          if (chapter) {
            this.number = this.number - 1;
            let content = this.constructor.nbsp2Space(chapter.content);
            let _arr = Util.handleContent(content);
            this.nextChapter = this.currentChapter;
            this.currentChapter = _arr.length;
            _arr.forEach(_item => {
              let _chapterInfo = {
                title: chapter.title,
                num: chapter.number,
                content: _item
              };
              arr.push(_chapterInfo);
            });
            this.setState({
              searching: true
            })
            this._unshiftData(arr)
          }
        });
    }
  }
  renderListView() {
    return (
      <ListView
        enableEmptySections
        horizontal={true}
        pagingEnabled={true}
        initialListSize={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        dataSource={this.state.dataSource.cloneWithRows(this._data)}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
  renderContent(rowData) {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.chapterName}>{rowData.title}</Text>
        </View>
        <View style={styles.chapterContent}>
          {rowData.content
            ? rowData.content.map((value, index, chapterContent) => {
                return (
                  <Text style={styles.ficContent} key={index}>
                    {value}
                  </Text>
                );
              })
            : null}
        </View>
        <View style={styles.foot}>
          <Text style={[styles.footLeft, styles.chapterName]}>
            本章进度{this.state.chapterProgress}%
          </Text>
          <Text style={[styles.footRight, styles.chapterName]}>
            {rowData.num}/{this.totals}
          </Text>
        </View>
      </View>
    );
  }
  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ height: Util.size.height, width: tabWidth }}
          activeOpacity={1}
          onPress={() => this.show()}
        >
          {this.renderContent(rowData)}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref="scrollView"
          scrollEventThrottle={800}
          horizontal={true}
          onScroll={e => this.handleScroll(e)}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
        >
          {this.state.searching ? this.loading() : this.renderListView()}
        </ScrollView>
        {this.state.hide ? null : this.showReaderOptions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9DFC7",
    flexDirection: "column"
  },
  top: {
    height: 10,
    marginTop: 20,
    marginLeft: 10
  },
  chapterContent: {
    // backgroundColor: '#604733',
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    height: Util.size.height - 75,
    overflow: "hidden"
  },
  chapterName: {
    fontSize: 10,
    color: "#A58F72"
  },
  bigChapterName: {
    fontSize: 22
  },
  ficContent: {
    color: "#604733",
    fontSize: 19,
    lineHeight: 34
  },
  foot: {
    height: 12,
    marginLeft: 10,
    width: tabWidth - 20,
    flexDirection: "row",
    bottom: -10
  },
  footLeft: {
    flex: 1,
    width: 70
  },
  footRight: {
    flex: 1,
    textAlign: "right"
  },
  alertContainer: {
    position: "absolute",
    width: Util.size.width,
    height: Util.size.height
  },
  alertTop: {
    height: 70,
    backgroundColor: "#3B3A38",
    flexDirection: "row"
  },
  alertMiddle: {
    height: Util.size.height - 140
  },
  alertFoot: {
    height: 70,
    backgroundColor: "#3B3A38"
  },
  backImg: {
    marginTop: 30,
    marginLeft: 10
  },
  directoryImg: {
    marginLeft: 10,
    marginTop: 10
  },
  directoryText: {
    marginLeft: 12,
    color: "#9D9C9B"
  }
});

const mapStateToProps = state => ({
  firstChapter: state.reader.firstChapter,
  chapter: state.reader.chapter
});

export default connect(mapStateToProps)(Reader);
