const DefaultControllerAttributes = [
    'mouseScreenX',
    'mouseScreenY',
    'mouseX',
    'mouseY',
    'mouseButton0',
    'mouseButton1',
    'mouseButton2',
    'mouseButton3',
    'mouseButton4',
    'mouseButton5',
    'mouseButton6',
    'mouseButton7',
    'mouseButton8',
    'mouseButton9'
];

class Controller
{
    attributes = {};
    press = null;
    map = {};

    constructor(bindings)
    {
        let that = this;

        if (bindings)
        {
            DefaultControllerAttributes.forEach(
                function(attributeCode)
                {
                    if (!bindings[attributeCode])
                    {
                        bindings[attributeCode] = [ attributeCode ];
                    }
                }
            );
            Object.keys(bindings).forEach(
                function(attributeCode)
                {
                    that.attributes[attributeCode] = false;
                    bindings[attributeCode].forEach(
                        function(inputCode)
                        {
                            that.map[inputCode] = attributeCode;
                        }
                    );
                }
            );
        }

        window.addEventListener(
            'keydown',
            function(e)
            {
                let code = e.code;
                let attributeCode = that.map[code];
                if (attributeCode && !that.attributes[attributeCode])
                {
                    that.attributes[attributeCode] = true;
                }
            }
        );

        window.addEventListener(
            'keyup',
            function(e)
            {
                let code = e.code;
                let attributeCode = that.map[code];
                if (attributeCode && that.attributes[attributeCode])
                {
                    that.attributes[attributeCode] = false;
                    if (that.press)
                    {
                        that.press(attributeCode);
                    }
                }
            }
        );

        function smooth(oldValue, newValue, oldValueBias)
        {
            if (!oldValue)
            {
                return newValue;
            }
            if (!oldValueBias || oldValueBias < 0) oldValueBias = 0;
            if (oldValueBias > 1) oldValueBias = 1;
            return oldValue * oldValueBias + newValue * (1 - oldValueBias);
        }

        window.addEventListener(
            'mousemove',
            function(e)
            {
                let attributeCode = that.map['mouseScreenX'];
                if (attributeCode)
                {
                    that.attributes[attributeCode] = smooth(that.attributes[attributeCode], e.screenX, 0.4);
                }
                attributeCode = that.map['mouseScreenY'];
                if (attributeCode)
                {
                    that.attributes[attributeCode] = smooth(that.attributes[attributeCode], e.screenY, 0.4);
                }
                attributeCode = that.map['mouseX'];
                if (attributeCode)
                {
                    that.attributes[attributeCode] = smooth(that.attributes[attributeCode], e.x, 0.4);
                }
                attributeCode = that.map['mouseY'];
                if (attributeCode)
                {
                    that.attributes[attributeCode] = smooth(that.attributes[attributeCode], e.y, 0.4);
                }
            }
        );

        window.addEventListener(
            'mousedown',
            function(e)
            {
                let code = 'mouseButton'+ e.button;
                let attributeCode = that.map[code];
                if (attributeCode && !that.attributes[attributeCode])
                {
                    that.attributes[attributeCode] = true;
                }
            }
        );

        window.addEventListener(
            'mouseup',
            function(e)
            {
                let code = 'mouseButton'+ e.button;
                let attributeCode = that.map[code];
                if (attributeCode && that.attributes[attributeCode])
                {
                    that.attributes[attributeCode] = false;
                }
            }
        );

        window.addEventListener(
            'wheel',
            function(e)
            {
                that.attributes['mouseWheel'] = smooth(that.attributes['mouseWheel'], e.wheelDeltaY, 0.8);
            }
        );
    }

    Reset()
    {
        this.attributes['mouseWheel'] = 0;
    }
}
