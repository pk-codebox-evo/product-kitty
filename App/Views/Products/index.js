var React = require('react-native');
var styles = require('./styles.js');
var api = require('../../Utils/api.js');
var Cell = require('./Cell');
var Item = require('../Item');

var {
  Text,
  View,
  ListView
} = React;

var Products = React.createClass({
  getInitialState: function() {
    return {
      accessToken: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      loaded: false
    }
  },
  componentWillMount: function () {
    if (!this.state.accessToken){
    fetch(api.token.link, api.token.object)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          accessToken: responseData.access_token,
        });
      })
      .then(() => {
        this.getPosts();
      })
      .done();
    }
  },
  getPosts: function() {
    var headersObj = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.accessToken}`,
        'Origin': '',
        'Host': 'api.producthunt.com'
      }
    };
    fetch('https://api.producthunt.com/v1/posts/', headersObj)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.posts),
          loaded: true
        })
      })
      .done();
  },
  render: function() {
    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text style={styles.loadingText}>
            Loading...
          </Text>
        </View>
      )
    }
    return (
      this.renderListView()
    )
  },
  renderListView: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderPostCell}
        style={styles.postsListView}
      />
    )
  },
  renderPostCell: function(post) {
    return (
        <Cell
          onSelect={() => this.selectPost(post)}
          post={post}/>
    )
  },
  selectPost: function(post) {
    this.props.navigator.push({
      title: post.name,
      component: Item,
      passProps: {post_id: post.id,
                  post_name: post.name,
                  post_tagline: post.tagline,
                  accessToken: this.state.accessToken}
    })
  }
})

module.exports = Products;
