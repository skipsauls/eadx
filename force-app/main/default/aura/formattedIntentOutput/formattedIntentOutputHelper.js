({
    PARAM_REG_EX: function(string){
        return /(^|\s+)\((.*?)\)/g.exec(string);
    },
    COMPOSITE_REG_EX: function(string){
        return /\[(.*?)\]/g.exec(string);
    },
	produceBody: function(cmp) {
        var phrase = cmp.get('v.phrase');
        var parameterMap = this.generateParameterMap(cmp.get('v.actionParameters'));
        var defaultValuesByType = cmp.get('v.defaultParameterValueMap');
        var paramValues = cmp.get('v.values');
        if (!paramValues){
            paramValues = {};
        }
		var segments, fragments, parameters, index, plainText, f;
        var phraseFragments = []
        if (phrase && phrase.length > 0){
            segments = phrase.split(/\s+(?![^\(]*\))(?![^\[]*\])/g);
            index = 0;
            while(index < segments.length-1){
                plainText = phraseFragments.length > 0 ? ' ' : '';
                fragments = this.scanForNonParameters(index, segments);
                for (f in fragments){
                    if (plainText.length > 0){
                        plainText += " ";
                    }
                    plainText += this.extractSegmentFromComposite(fragments[f]);
                    index++;
                }
                fragments = this.scanForParameters(index, segments);
                if(fragments.length > 0){
                    plainText += ' ';
                }
                phraseFragments.push({value: plainText, isParameter: false});
                for (f in fragments){
                    phraseFragments.push(this.extractParameterFromSegment(fragments[f], paramValues, parameterMap, defaultValuesByType));
                    index++;
                } 
            }
        }
        cmp.set('v.phraseFragments', phraseFragments);
	},
    generateParameterMap: function(parameterArray){
        var rv = {};
        var p, param;
        if (parameterArray && parameterArray.length > 0){
            for (p in parameterArray){
                param = parameterArray[p];
                rv[param.name] = param;
            }
        }
        return rv;
    },
    scanForNonParameters: function(index, segments){
        var rv = [];
        var segment, match;
        while(index < segments.length){
            segment = segments[index++].trim();
            match = this.PARAM_REG_EX(segment);
            if (!match){
                rv.push(segment);
            } else{
                break;
            }
        }
        return rv;
    },
    scanForParameters: function(index, segments){
        var rv = [];
        var segment, match;
        while(index < segments.length){
            segment = segments[index++].trim();
            match = this.PARAM_REG_EX(segment);
            if (match){
                rv.push(segment);
            } else{
                break;
            }
        }    
        return rv;
    },
    extractSegmentFromComposite: function(segment){
        var matches = this.COMPOSITE_REG_EX(segment);
        return matches ?
            matches[1].split("|")[0] :
        	segment;
    },
    extractParameterFromSegment: function(segment, paramValues, parameterMap, defaultValues){
        var matches = this.PARAM_REG_EX(segment);
        var paramSegments;
        var rv = null;
        var isExplicit = false;
        var name, value, type;
        if (matches){
            paramSegments = matches[2].split("=");
            if (paramSegments.length === 0){
                return null;
            }
            name = paramSegments[0];
            value = paramValues[name] ? paramValues[name] : null;
            rv = {name: name, isParameter: true};
            if (value || (paramSegments.length > 1 && paramSegments[1].trim() !== "")){
                if (!value){
                	value = paramSegments[1].trim();                    
                    isExplicit = !value.endsWith("?");
                    rv['isExplicit'] = isExplicit;
                } else {
                    isExplicit = true;
                }
                rv['value'] = isExplicit ? value : value.substring(0, value.length-1);
                if (parameterMap && parameterMap[name]){
                    rv['parameterInfo'] = 'type:' + parameterMap[name].type + 
                        ', default:' + parameterMap[name].defaultValue;
                } else {
                    rv['parameterInfo'] = 'type:' + 'StringType';
                }
            } else {
                if (parameterMap && parameterMap[name]){
                    rv['parameterInfo'] = 'type:' + parameterMap[name].type + ', default:' + parameterMap[name].defaultValue;
                    if (!parameterMap[name].defaultValue){
                        rv['value'] = value ? value : defaultValues[parameterMap[name].type];
                    } else {
                        rv['value'] = value ? value : parameterMap[name].defaultValue;
                    }
                } else {
                    rv['parameterInfo'] = 'type:' + parameterMap[name].type;
                    rv['value'] = defaultValues['StringType'];
                }
            }
        }
        return rv;
    }
})