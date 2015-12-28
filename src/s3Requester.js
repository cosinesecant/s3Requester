
var s3Requester = {};

(function (s3) {
    
    s3.responseTypeBinary = 'arraybuffer';
    s3.responseTypeText = 'text';
    s3.requestTypeGet = 'GET';
    s3.requestTypePost = 'POST';
    s3.defaultTimeOut = 500;
    
    var formatDateStrUTC = function (formatStr, dateObj) {
        var strBuf = [];
        var i = 0, len = formatStr.length;
        var cnt = 0;
        var padNumStr = function (srcStr, digits, padChar) {
            for (var i = srcStr.length; i < digits; i++) {
                srcStr = padChar + srcStr;
            }
            return srcStr;
        };
        var caseProc = function (char, str) {
            cnt++;
            if (char === formatStr[i + 1]) {
                i++;
            } else if ('%' === formatStr[i + 1]) {
                strBuf.push(str);
                i += 2;
                cnt = 0;
            } else {
                strBuf.push(padNumStr(str, cnt, '0'));
                i++;
                cnt = 0;
            }
        };
        while (i < len) {
            switch (formatStr[i]) {
                case 'y': 
                    caseProc('y',dateObj.getUTCFullYear().toString());
                break;
                case 'M':
                    caseProc('M',(dateObj.getUTCMonth()+1).toString());
                 break;
                case 'd': 
                    caseProc('d',dateObj.getUTCDate().toString());
                break;
                case 'h': 
                    caseProc('h',dateObj.getUTCHours().toString());
                break;
                case 'm': 
                    caseProc('m',dateObj.getUTCMinutes().toString());
                break;
                case 's': 
                    caseProc('s',dateObj.getUTCSeconds().toString());
                break;
                default: {
                    strBuf.push(formatStr[i]);
                    i++;
                }
            }
        }
        return strBuf.join('');
    };
    
    s3.getPublicFile = function(requestUrl,callback,responseType,timeoutms,timeoutCallback) {
        var xAmzDate = formatDateStrUTC('yyyyMMddThhmmssZ',new Date());
        var doneCallbackHandler = function() {
            callback.call(this,this.status,this.response);
        };
        var opts = {
            type:'GET',
            url:requestUrl,
            doneCallBackHandler:doneCallbackHandler,
            responseType:responseType||s3.responseTypeBinary,
            timeout:timeoutms,
            ontimeout:timeoutCallback,
            headers:{
                'x-amz-date':xAmzDate,
            }
        };
    };

})(s3Requester);