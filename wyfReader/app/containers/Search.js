import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet
} from "react-native";
import { Toast } from 'antd-mobile';
import { NavigationActions } from "../utils";
import Util from "../utils/utils";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: false,
      novelNames: [],
      searchBooks: []
    };
  }
  getNovelList = name => {
    Toast.loading('loading...');
    this.props
      .dispatch({
        type: "app/getNovelList",
        payload: { name }
      })
      .then(() => {
        Toast.hide();
        this.setState({
          searchBooks: this.props.searchBooks,
          list: true
        });
      });
  };
  goBack = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: "Home" }));
  };
  searchNovelList = ingredientsInput => {
    console.log(ingredientsInput);
    this.state.list = false;
    this.props
      .dispatch({
        type: "app/searchBookWords",
        payload: { text: ingredientsInput }
      })
      .then(() => {
        this.setState({
          novelNames: this.props.bookNames
        });
      });
  };
  goDetail = (item) => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail', params: { item } }))
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <View style={styles.topBox}>
            <TouchableOpacity
              style={styles.topBack}
              onPress={() => {
                this.goBack();
              }}
            >
              <Image
                style={styles.backImg}
                source={require("../images/back.png")}
              />
            </TouchableOpacity>
            <View style={styles.topSearch}>
              <View style={styles.searchSection}>
                <View style={styles.searchImgBox}>
                  <Image
                    source={require("../images/search_1.png")}
                    style={styles.searchImg}
                  />
                </View>
                <TextInput
                  style={styles.searchInput}
                  placeholder="搜索书名"
                  onChangeText={ingredientsInput =>
                    this.searchNovelList(ingredientsInput)
                  }
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
            {this.state.list
              ? this.state.searchBooks.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.listSection}
                    onPress={() => {
                      this.goDetail(item);
                    }}
                  >
                    <View style={styles.listLeft}>
                      <Image
                        source={{ uri: item.img }}
                        style={styles.listImg}
                      />
                    </View>
                    <View style={styles.listRight}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.introduction} numberOfLines={2}>
                        {item.introduction}
                      </Text>
                      <View style={{ marginTop: 10, flexDirection: "row" }}>
                        <Image source={require("../images/person.png")} />
                        <Text style={{ marginLeft: 5 }}>{item.author}</Text>
                        <Text style={{ marginLeft: 10, color: "#C9CBE6" }}>
                          {item.type}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              : this.state.novelNames.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectSection}
                    onPress={() => {
                      this.getNovelList(item.word);
                    }}
                  >
                    <View style={styles.selectedLeft}>
                      <Image
                        source={require("../images/search_1.png")}
                        style={styles.selectedImg}
                      />
                    </View>
                    <View style={styles.selectedRight}>
                      <Text style={styles.novelName}>{item.word}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nav: {
    flex: 0.1,
    backgroundColor: "rgb(52,120,246)"
  },
  topBox: {
    height: 40,
    marginTop: 20,
    flexDirection: "row"
  },
  topBack: {
    flex: 0.1
  },
  backImg: {
    marginLeft: 5,
    marginTop: 3
  },
  topSearch: {
    flex: 0.9
  },
  searchSection: {
    flex: 1,
    marginRight: 20,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: "#FFFFFF"
  },
  searchImgBox: {
    flex: 0.15
  },
  searchImg: {
    marginTop: 10,
    marginLeft: 20
  },
  searchInput: {
    flex: 0.85
  },
  content: {
    flex: 0.9
  },
  selectSection: {
    height: 50,
    borderBottomLeftRadius: 20,
    borderBottomWidth: Util.pixel,
    borderColor: "#999999",
    flexDirection: "row"
  },
  selectedLeft: {
    flex: 0.2
  },
  selectedImg: {
    marginTop: 15,
    marginLeft: 30
  },
  selectedRight: {
    flex: 0.6
  },
  novelName: {
    marginTop: 13,
    fontSize: 18,
    color: "#A9A9A9"
  },
  listSection: {
    height: 120,
    borderBottomLeftRadius: 20,
    borderBottomWidth: Util.pixel,
    borderColor: "#999999",
    flexDirection: "row"
  },
  listLeft: {
    flex: 0.3
  },
  listImg: {
    height: 100,
    width: 80,
    marginLeft: 8,
    marginTop: 10,
    marginBottom: 10
  },
  listRight: {
    flex: 0.7
  },
  title: {
    marginTop: 10,
    fontSize: 18
  },
  introduction: {
    marginTop: 10,
    marginRight: 10,
    color: "#A1A1A1"
  }
});

const mapStateToProps = state => ({
  bookNames: state.app.bookNames,
  bookList: state.app.bookList,
  searchBooks: state.app.searchBooks,
});
export default connect(mapStateToProps)(Search);
