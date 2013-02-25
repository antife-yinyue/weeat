moment.lang('en', {
  weekdays: [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六'
  ]
})

var current = moment()
// 15:00后显示明天的菜单
if (current.hour() >= 15) {
  current = current.add('days', 1)
}

var start = current.date()
var end = current.clone().endOf('month').date()
var human_format = 'YYYY年MM月DD日 dddd'

var operTpl = juicer(
  '<div class="oper">' +
    '<select id="oper" autocomplete="off">$${options}</select>' +
    '<a href="#" id="donate">我要捐赠午餐券</a>' +
  '</div>'
)
var optionTpl = juicer(
  '<option value="${short}"' +
  '{@if selected} selected="selected"{@/if}' +
  '>${human}</option>'
)
var menuTpl = juicer(
  '{@each menus as menu,key}' +
    '<div class="menu">' +
      '<h2>${key}</h2>' +

      '{@each menu.names as name}' +
        '<p>${name}</p>' +
      '{@/each}' +

      '{@if menu.price > basePrice}' +
        '<h3>+ ${menu.price - basePrice}元</h3>' +
      '{@/if}' +
    '</div>' +
  '{@/each}'
)

function callback(data, baseMoment) {
  var options = ''
  var thisMenu = data[baseMoment.date()]
  var thisMoment

  for (var i = start; i <= end; i++) {
    if (data.hasOwnProperty(i)) {
      thisMoment = baseMoment.clone().date(i)

      options += optionTpl.render({
        'short': thisMoment.format('YYYY-MM-DD'),
        'human': thisMoment.format(human_format),
        'selected': thisMoment.isSame(baseMoment)
      })
    }
  }

  var title = juicer('<h1>${title}</h1>', {
    title: baseMoment.format(human_format)
  })
  var oper = operTpl.render({ options: options })
  var menus = menuTpl.render({
    menus: thisMenu,
    basePrice: thisMenu.A.price
  })

  $(document.body).html(title + oper + menus)
}

$(function() {
  var file = 'menus/' + current.format('YYYY-MM') + '.json'
  var data

  $.getJSON(file, function(res) {
    callback(res, current)
    data = res
  })

  $(document).on('change', '#oper', function() {
    callback(data, moment($(this).val()))
  }).on('click', '#donate', function(e) {
    e.preventDefault()
    alert('正在施工，请耐心等待。。。')
  })
})
