import redis from 'redis'
export const client = redis.createClient();
client.on("error", function(error) {
    console.error(error);
});
export const resultPrint = redis.print;