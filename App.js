import React from 'react';
import { StyleSheet, Text, TextInput, View, 
         Button, FlatList, RefreshControl } from 'react-native';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

let baseurl = "http://192.168.1.37:8080/api";

class MainScreen extends React.Component{
  constructor(props) {
    super(props);
    this.getTasks = this.getTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);

    this.state = {
      dataSource: [],
      refreshing: false,
    };
  }

  componentWillMount() {
    this._onRefresh();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getTasks();
    this.setState({refreshing: false});
  }

  async getTasks(){
    let url = baseurl + "/tasks.json";

    response = await fetch(url, {
      method: 'GET',
      headers: {
          Accept: 'application/json',
      }
    }).then((response) => {
      return response.json();
    }).then((responseJson) => {
      //console.log(responseJson);
      this.setState({
        dataSource: responseJson,
      });
      return responseJson;
    }).catch((error) => {
      //console.log(error);
      throw(error);
    });
  }

  async toggleTask(task){
    response = await fetch(task.url, {
      method: 'PUT',  
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: task.text,
        done: !task.done
      }),
    }).then((response) => {
      //console.log(response.json());
    }).then((responseJson) => {
      //console.log(responseJson);
    }).catch((error) => {
      throw(error);
    });
  }

  async deleteTask(taskurl){
    response = await fetch(taskurl, {
      method: 'DELETE',
    });
  }

  render() {
    return (
      <View style={[{marginTop: 25}]}>
        <Text style={[{fontSize: 54, fontWeight: 'bold', color: 'grey'}]}>
          Tasks TO DO
        </Text>
        <FlatList style={{marginBottom: 25}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
          <View style={{flexDirection:"row",
                        flex:1,
                        flexWrap: 'wrap',
                        justifyContent:'space-between', 
                        marginBottom: 0.5, 
                        borderBottomWidth: 1, 
                        borderBottomColor: 'grey',
                        }}>
            <View>
              <Text style={[{fontSize: 18,
                             textDecorationStyle: 'solid',
                             textDecorationLine: (item.done ? 'line-through' : 'none') 
                            }]}
              onPress={() => {
                this.toggleTask(item).then(() => this._onRefresh());
              }}>{item.text}</Text>
            </View>
            <Button style={{backgroundColor: 'red'}}
              onPress={() => {
                this.deleteTask(item.url).then(() => this._onRefresh());
              }} title="Delete"/>
          </View>
          }
          keyExtractor={item => item.url}
        />
      </View>
    );
  }
}

class AddScreen extends React.Component{
  constructor(props) {
    super(props);
    this.postTask = this.postTask.bind(this);
    this.state = { text: '' };
  }

  postTask(){
    let url = baseurl + "/tasks.json";

    fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          text: this.state.text,
          done: false
      }),
    }).then((response) => {
      return response.json()
    }).then((responseJson) => {
      console.log(responseJson);
      return responseJson;
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>New Task</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            />
          <Button title="New task" onPress={ () => {
            this.postTask();
          }}/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator = createBottomTabNavigator({
  Home: MainScreen,
  Add: AddScreen,
});

export default createAppContainer(TabNavigator);