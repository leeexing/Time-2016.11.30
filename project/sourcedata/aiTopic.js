/**
 * AI
 * 考题
*/

mongoimport -d sourceData -c ai_topic --file "D:/sourcedata/mongoData/20200102_ai_topic.json" --type json --upsert -h "10.15.225.23" --port 27017 -u root -p root123 --authenticationDatabase=admin