define(['ojs/ojanimation'], function(){
    function animationUtil(){
        var self = this;
        self.animate = (elementId, elementAnimation) => {
            return oj.AnimationUtils[elementAnimation](document.getElementById(elementId), {timingFunction: 'ease', direction: 'right', duration: '300ms' })
              /*.then(() => {
                document.getElementById(outElementId).style.visibility = 'hidden';
              })
              .then(() => {
                oj.AnimationUtils[inElementAnimation](document.getElementById(inElementId), {timingFunction: 'ease', delay: '300ms', direction: 'left' });
              })
              .then(() => {
                document.getElementById(inElementId).style.visibility = 'visible';
              })
              .catch((err) => {
                console.log(err);
              })*/
              ;
          };
    };
    return new animationUtil();
    
});