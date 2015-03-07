var FrontView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function(){
    this.$el.html('<div class="front-page-main"> \
                     <button id="create-game">Create Game</button> \
                     <button id="join-game">Join Game</button> \
                   </div>')
  }
})