module.exports = {
    init: function(){
        document.getElementById('scrollPanel').onscroll = function() {
        console.log("scrolling");
      };
    }
}