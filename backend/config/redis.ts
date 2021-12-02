import redis from 'redis'
export const client = redis.createClient();
client.on("error", function(error) {
    console.error(error);
});
export const resultPrint = redis.print;

export const updateOrDeleteToken = (token:string, updateToken:string|null, option:number)=>{
    if(option === 1){
        client.get(token, (err, data)=>{
            client.set(updateToken!, data!);
        })
        client.del(token);
    }else{
        client.del(token);
    }
}