import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";
import { SID, API } from './config.js'
import * as fs from "node:fs"


const rawdata = fs.readFileSync('user.json') // <=================================== имя JSON файла
const userList = JSON.parse(rawdata)
console.log(userList)

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: API }));
const words = SID.split(' '); 
const key = await tonMnemonic.mnemonicToKeyPair(words);
const wallet = await new tonweb.wallet.all.v4R2(tonweb.provider, {publicKey: key.publicKey,
    wc: 0
    });


    const sendTon = async (address, sum, seq) =>{
    

       
        
            await wallet.methods.transfer({
                secretKey: key.secretKey,
                toAddress: address,
                amount: TonWeb.utils.toNano(sum), 
                seqno: seq,
                payload:"",   // <=================================== Комментарий
                sendMode: 3,
            }).send()
            
          
            
        }


let lastseqno = await wallet.methods.seqno().call() - 1;
let newseqno;
 for (const key in userList.users){

    while(true){

    newseqno = await wallet.methods.seqno().call();


    // console.log(`Полученный номер для транзакции - ${newseqno}\nНомер последний транзакции - ${lastseqno}\n\n`)


    if (newseqno === lastseqno + 1){
    
    //console.log("Все ок, запускаю отправку")
    await console.log(`\nПозиция: ${key} Адрес: ${userList.users[key].address} Сумма: ${userList.users[key].sum} Номер транзакции: ${newseqno}`)
    await sendTon(userList.users[key].address, userList.users[key].sum, newseqno);
    await console.log(`DONE!\nЖдем обновления номера транзакции\n`)
    lastseqno = newseqno;
    await sleep(10000)
    break;
    }else{
        //console.log(`Номер транзакции еще не обновился, подождем 5 секунд\n \n`)
        await sleep(5000)
    }
    }
 }

 console.log("Отправка завершена")

 
 function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



