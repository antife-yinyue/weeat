#coding: utf-8
require 'httpclient'
require 'nokogiri'

url='http://www.6am9pm.com/'
path='product/daydetail'
file_path="/Users/jay-jay/github/weeat/menus"
month=Time.new.strftime("%Y-%m").to_s
menu_per_month=[]
client=HTTPClient.new
(1..31).each do|day|
  data=month+"-"+day.to_s
  menu_raw_html=client.get(url+path,:menudate=>data).body.gsub('&nbsp;','')
  menu_raw = Nokogiri::HTML(menu_raw_html.strip)
  title=[]
  price=[]
  entree=[]
  dessert=[]
  soup=[]
  vegetable=[]
  menu_per_day=[]
  4.times do |i|
    begin
      combo_dish = menu_raw.css("div[class='suitFoot']")[i]
      title[i] = combo_dish.css("div[class='productInfoName']").inner_text.gsub('套餐','')
      price[i] = combo_dish.css("div[class='productInfoPrice']").inner_text.gsub('￥','').to_f
      entree[i] = combo_dish.css("b").to_s.split('<br>')[0].gsub('<b>','').gsub('主菜：','')
      soup[i] = combo_dish.css("b").to_s.split('<br>')[1].gsub('</b>','').gsub('汤：','')
      dessert[i] = combo_dish.inner_text.to_s.scan(/辅菜：(\S*)蔬菜：/).join
      vegetable[i] = combo_dish.inner_text.to_s.scan(/蔬菜：(\S*)/).join
      menu_per_day[i]="\"#{title[i]}\": {\"price\": #{price[i]},\"names\":[\"#{entree[i]}\",\"#{dessert[i]}\",\"#{soup[i]}\",\"#{vegetable[i]}\"]}"
    rescue
    end
  end
  menu_per_month[day]="\"#{day}\": {"+menu_per_day.join(',')+"}"
  File.open(file_path+"/#{month}.json",'w') do |f|
    f.puts "{"+menu_per_month[1,menu_per_month.length-1].join(',')+"}"
  end
end
