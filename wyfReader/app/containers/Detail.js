import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text
} from "react-native";
import { connect } from "react-redux";
import DeviceInfo from "react-native-device-info";

import { NavigationActions } from "../utils";
import Util from "../utils/utils";

class Detail extends Component {
  static navigationOptions = {
    title: "Detail",
    novelInfo: null
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const { item } = this.props.navigation.state.params;
    const { title, url } = item;
    this.props
      .dispatch({
        type: "app/getNovelInfo",
        payload: {
          name: title,
          url
        }
      })
      .then(() => {
        this.setState({
          novelInfo: this.props.novelInfo,
          novelType: item.type
        });
      });
  }
  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: "Detail" }));
  };

  goBack = () => {
    this.props.dispatch(NavigationActions.back());
  };

  orderNovel = (id, join) => {
    if (!join) {
      this.props.dispatch({
        type: 'app/orderNovel',
        payload: { id }
      })
    }
    
    this.props.dispatch(NavigationActions.navigate({ routeName: "Home" }));
  }

  renderBookInfo = (novelInfo) => {
    if (!novelInfo) {
      return (
        <View style={styles.loading}>
          <Text>等哈，正在拼命加载</Text>
        </View>
      );
    }
    if (!novelInfo.name) {
      return (
        <View style={styles.loading}>
          <Text>哈哈，毛都没有一根！</Text>
        </View>
      );
    }
    console.log(novelInfo,555555)
    return (
      <View style={styles.detailSection}>
        <View style={styles.novelInfo}>
          <View style={styles.infoLeft}>
            <Image
              style={styles.img}
              source={{ uri: novelInfo.img }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoRight}>
            <Text style={styles.novelTitle}>{novelInfo.name}</Text>
            <Text style={styles.text}>类型：{this.state.novelType}</Text>
            <Text style={styles.text}>作者：{novelInfo.author}</Text>
            <Text style={styles.text}>更新时间：{novelInfo.updateTime}</Text>
            <Text style={styles.text}>
              最新章节：{novelInfo.lastChapterTitle}
            </Text>
          </View>
        </View>
        <View style={styles.middle}>
          <TouchableHighlight
            style={styles.bigButton}
            onPress={() => this.orderNovel(novelInfo._id, novelInfo.join)}
          >
            <Text style={styles.bigText}>
              {novelInfo.join ? "已加入书架" : "加入书架"}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.startBtn}
            onPress={ () => this.props.dispatch(NavigationActions.navigate({ routeName: 'Reader', params: {id: novelInfo._id, name: novelInfo.name, num: 0} })) }
          >
            <Text style={styles.startRead}>开始阅读</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.introduction}>
          <Text style={styles.introductionText}>{novelInfo.introduction}</Text>
        </View>
      </View>
    );
  };
  render() {
    const { novelInfo } = this.state;
    console.log(novelInfo, 4545);
    return (
      <View style={styles.scene}>
        <View style={styles.nav}>
          <View style={[styles.button]}>
            <TouchableOpacity
              onPress={() => {
                // this.props.navigateBack({ key: "Reader" });
                this.goBack();
              }}
              style={styles.button}
            >
              <Image
                source={require("../images/back.png")}
                style={styles.leftButton}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.title]}>
            <Text style={styles.titleText}>作品详情</Text>
          </View>
          <View style={[styles.button]} />
        </View>
        {this.renderBookInfo(novelInfo)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "center",
    marginTop: 25
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  nav: {
    backgroundColor: "#A49B93",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 99
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    flex: 1,
    height: 66,
    justifyContent: "center"
  },
  titleText: {
    marginTop: 25,
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff"
  },
  leftButton: {
    marginTop: 25,
    marginRight: 5
  },
  detailSection: {
    flex: 1
  },
  novelInfo: {
    flex: 0.4,
    flexDirection: "row",
    backgroundColor: "#7C6958"
  },
  middle: {
    flex: 0.1,
    flexDirection: "row",
    borderBottomWidth: Util.pixel,
    borderColor: "#A5A5A5",
    paddingBottom: 20,
    paddingTop: 30
  },
  bigButton: {
    borderRadius: 5,
    flex: 0.5,
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#DD3F42"
  },
  bigText: {
    fontSize: 18,
    color: "#FEFBFB",
    marginTop: 10,
    textAlign: "center"
  },
  startBtn: {
    borderRadius: 5,
    flex: 0.5,
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#FF3F42"
  },
  startRead: {
    fontSize: 18,
    color: "#FEFBFB",
    marginTop: 10,
    textAlign: "center"
  },
  introduction: {
    flex: 0.4
  },
  infoLeft: {
    flex: 0.3
  },
  img: {
    marginTop: 20,
    marginLeft: 20,
    height: 110,
    width: 80
    // backgroundColor: '#A49B93',
  },
  infoRight: {
    flex: 0.6
  },
  novelTitle: {
    marginTop: 25,
    fontSize: 18,
    color: "#E5E3DF"
  },
  text: {
    marginTop: 15,
    color: "#E5E3DF"
  },
  introductionText: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20
  }
});

const mapStateToProps = state => ({
  bookNames: state.app.bookNames,
  novelInfo: state.app.NovelInfo
});
export default connect(mapStateToProps)(Detail);
