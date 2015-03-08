var JoinView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  events: {
    'click #player-join-black': "joinBlack",
    'click #player-join-white': "joinWhite"
  },
  render: function(){
    var html = "<p id='current-turn'></p>  \
                <div class='player-box-1'> \
                  <p id='player-id-black'></p> \
                  <button id='player-join-black'>Black</button> \
                </div> \
                <div class='player-box-2'> \
                  <p id='player-id-white'></p> \
                  <button id='player-join-white'>White</button> \
                </div>"

    this.$el.html(html);
    var players = this.model.get('players');

    for(var key in players){
      if(key === 'white'){
        $('#player-join-white').hide();
        $('#player-id-white').text(players[key].slice(0,6))
      }
      if(key === 'black'){
        $('#player-join-black').hide();   
        $('#player-id-black').text(players[key].slice(0,6))
      }
    }
  },
  joinBlack: function(){
    if(!this.model.get('me')){
      this.model.set('me', 'black');
      socket.emit('join', game.attributes);
    }
  },
  joinWhite: function(){
    if(!this.model.get('me')){
      this.model.set('me', 'white');
      socket.emit('join',game.attributes);
    }
  }
});