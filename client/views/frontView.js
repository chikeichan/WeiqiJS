var FrontView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  events: {
    'click button#create-game': 'createGame',
    'click button#join-game'  : 'toggleInput',
    'keydown input'           : 'joinGame'
  },
  render: function(){
    this.$el.html('<div class="front-page-main"> \
                     <button id="create-game">Create Game</button> \
                     <button id="join-game">Join Game</button> \
                     <input id="room-input" type="text"></input> \
                   </div>')
  },
  createGame: function(){
    this.$el.hide();
    // $('#team').hide();
    startGame();
  },
  toggleInput: function(){
    $('#join-game').toggle();
    $('input').toggle();
  },
  joinGame: function(d){
    console.log(d.keyCode);
    if(d.keyCode === 13 && $('input').val()){
      var room = $('input').val();
      this.$el.hide();
      startGame(room);
    }
  }
})