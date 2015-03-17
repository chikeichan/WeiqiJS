var FrontView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  events: {
    'click button#create-game': 'createGame',
    'click button#join-game'  : 'toggleInput',
    'keydown input'           : 'joinGame',
    'click button#instruction': 'toggleInstruction'
  },
  render: function(){
    this.$el.html('<div class="front-page-main"> \
                     <p id="title">WeiqiJS</p> \
                     <button id="instruction">Instruction</button> \
                     <button id="create-game">Create Game</button> \
                     <button id="join-game">Join Game</button> \
                     <input id="room-input" type="text" placeholder="Enter room name, then press enter..."></input> \
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
  },
  toggleInstruction: function(){
    $('#instruction-box').toggle();
  }
})