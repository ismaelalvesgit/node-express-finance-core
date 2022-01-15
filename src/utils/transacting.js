
const transacting = (query, trx)=>{
    if(trx){
        query.transacting(trx);
    }
    return query;
};

export default transacting;