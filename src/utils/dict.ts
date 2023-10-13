import {getJSONLocalstorage} from "@/utils/localStorage";


export interface DictDataType {
    dictType: string
    label: string
    value: string | number | boolean
}

export const getDictOptions = (dictType: string) => {
    const dictOption: DictDataType[] = []
    const dictOptions: DictDataType[] = getDict(dictType)

    dictOptions.forEach((dict: DictDataType) => {
        dictOption.push({
            ...dict,
            value: parseInt(dict.value + '')
        })
    })
    return dictOptions
}


const getDict = (dictType) => {
    const dictList = getJSONLocalstorage("DictList")
    return dictList.filter(m => m.dictType === dictType)

}


