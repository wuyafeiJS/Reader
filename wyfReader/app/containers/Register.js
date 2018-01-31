import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Svg, Path, Circle } from "react-native-svg";
import { connect } from "react-redux";
import { List, InputItem } from "antd-mobile";
import { createForm } from "rc-form";
import { createAction, NavigationActions } from "../utils";
import Util from "../utils/utils";
import Request from "../libs/request";

@connect((state) => ({registerData: state.app.registerData}))
class Register extends Component {
  static navigationOptions = {
    title: "Login"
  };
  constructor(props) {
    super(props);
    this.state = {
      msg: "在这里登录！",
      paths: []
    };
    this.headStyle = [styles.header];
  }
  componentWillMount() {
    Request.get("/users/captcha").then(res => {
      if (res.code === 0) {
        let arr = res.response.replace(/></g, ">|<").split("|");
        let paths = arr.slice(1, arr.length - 1);
        let results = this.handlePaths(paths);
        this.setState({
          paths: results
        });
      }
    });
  }
  handlePaths = paths => {
    let results = paths.map((v, k) => {
      let path = {};
      let d = v.match(/(d="[^a-z]+")/);
      let fill = v.match(/(fill="[^\s]+")/);
      let stroke = v.match(/(stroke="[^\s]+")/);

      path.d = d ? d[0].split("=")[1].replace(/"/g, "") : "";
      path.fill = fill ? fill[0].split("=")[1].replace(/"/g, "") : "none";
      path.stroke = stroke ? stroke[0].split("=")[1].replace(/"/g, "") : "none";
      return <Path key={k} d={path.d} fill={path.fill} stroke={path.stroke} />;
    });
    return results;
  };
  getCaptcha() {
    Request.get("/users/captcha").then(res => {
      if (res.code === 0) {
        let arr = res.response.replace(/></g, ">|<").split("|");
        let paths = arr.slice(1, arr.length - 1);
        let results = this.handlePaths(paths);
        this.setState({
          paths: results
        });
      }
    });
  }
  // onLogin = () => {
  //   this.props.dispatch(createAction("app/login")());
  // };

  onClose = () => {
    this.props.dispatch(NavigationActions.back());
  };
  handleClick = () => {
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (err) {
        this.headStyle = [styles.header, styles.err];
        let msg
        if (err.code) {
          msg = "请输入验证码！"
        }
        if (err.username || err.password || err.confirm) {
          msg = "请输入账号和密码！"
        }
        alert(msg)
        this.getCaptcha()
      } else {
        const { username, password, confirm, code } = value;
        if (password !== confirm) {
          alert('两次输入密码不一致，请重新输入')
          return;
        }
        console.log(this.props)
        this.props.dispatch({
          type: 'app/register',
          payload: {
            registerData: {
              password,
              username,
              code
            }
          }
        }).then(() => {
          const registerData = this.props.registerData;
          console.log(registerData,88)
          if (registerData.code === -1) {
            alert(registerData.msg)
            this.getCaptcha()
          }
        })
      }

    });
  };
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <View style={styles.container}>
        {/* {fetching
          ? <ActivityIndicator />
          : <Button title="Login" onPress={this.onLogin} />}
        {!fetching && <Button title="Close" onPress={this.onClose} />} */}
        <List.Item
          style={{ paddingLeft: 0 }}
        >
          <InputItem
            {...getFieldProps("username", {
              rules: [{ required: true }]
            })}
            clear
            placeholder="账号"
            name="username"
          >
            账号
          </InputItem>
          <InputItem
            {...getFieldProps("password", {
              rules: [{ required: true }]
            })}
            clear
            name="password"
            type="password"
            placeholder="密码"
          >
            密码
          </InputItem>

          <InputItem
            {...getFieldProps("confirm", {
              rules: [{ required: true }]
            })}
            clear
            name="password"
            type="password"
            placeholder="确认密码"
          >
            确认密码
          </InputItem>

          <View style={{ marginLeft: 0, flexDirection: "row" }}>
            <View style={styles.code}>
              <InputItem
                {...getFieldProps("code", {
                  rules: [{ required: true }]
                })}
                clear
                name="code"
                type="text"
                placeholder="验证码"
              >
                验证码
              </InputItem>
            </View>
            <View style={styles.codeWrap}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  this.getCaptcha()
                }}
              >
                <Svg style={styles.codeimg}>{this.state.paths}</Svg>
              </TouchableOpacity>
            </View>
          </View>
          <List.Item>
            <Button title="注册" onPress={this.handleClick} />
          </List.Item>
        </List.Item>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 0.5}} onPress={() => {
              this.onClose()
            }}>
            <Text style={[styles.register, {textAlign: 'left', paddingLeft: 10}]}>返回</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  header: {
    padding: 10,
    color: "#999"
  },
  err: {
    color: "#f00"
  },
  code: {
    flex: 0.6
  },
  codeWrap: {
    flex: 0.4,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#ddd",
    alignItems: "center",
    justifyContent: "center"
  },
  codeimg: {
    width: 80,
    height: 40
  },
  register: {
    color: '#007aff',
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 20
  }
});

export default createForm()(Register);
