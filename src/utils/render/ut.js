const VSymbol = {
    CREATE : 'CREATE', // 新建一个节点,
    REMOVE : 'REMOVE', // 删除原节点
    REPLACE : 'REPLACE', // 替换原节点
    UPDATE : 'UPDATE', // 检查属性或子节点是否有变化
    SET_PROP : 'SET_PROP', // 新增或替换属性
    REMOVE_PROP : 'REMOVE_PROP', // 删除属性
};
module.exports = {
    ...VSymbol
};
