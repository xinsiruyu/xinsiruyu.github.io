$(function() {
  var bmobApplicationId = '50129b1ebb64ca37e47972f4365268e9'
  var bmobRestApiKey = '17d414d5b60dd8f1c28c113e1801a48d'
  var url = window.location.hostname + window.location.pathname
  Bmob.initialize(bmobApplicationId, bmobRestApiKey)
  var Comment = Bmob.Object.extend('Comment')

  var queryObject = new Bmob.Query(Comment)
  queryObject.equalTo('url', url)
  queryObject.descending('time')
  queryObject.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        fillComment(results[i])
      }
      $('#comment-div>h2').text('留言板')
      $('#comment-div>form').fadeIn()
      $('#comment-div>ul').fadeIn()
    },
    error: function(e) {
      alert('留言加载失败')
      log.error(e)
    }
  })

  $('#comment-div>form>span').click(function() {
    var emailCheck = new RegExp(
      '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
    )
    var urlCheck = new RegExp('^https?://.+..+')

    var name = $.trim($('#comment-div>form>input:eq(0)').val())
    var email = $.trim($('#comment-div>form>input:eq(1)').val())
    var site = $.trim($('#comment-div>form>input:eq(2)').val())
    var content = $.trim($('#comment-div>form>textarea:eq(0)').val())

    if (name == '' || name.length > 20) {
      alert('昵称为空或长度大于20！')
      return
    }
    if (email != '' && (email.length > 50 || !emailCheck.test(email))) {
      alert('邮箱长度大于50或格式错误！')
      return
    }
    if (site != '' && (site.length > 120 || !urlCheck.test(site))) {
      alert('站点长度大于120或格式错误！')
      return
    }
    if (content == '' || content.length > 200) {
      alert('内容为空或长度大于200！')
      return
    }
    var updateObject = new Comment()
    updateObject.set('url', url)
    updateObject.set('nickName', name)
    updateObject.set('email', email)
    updateObject.set('website', site)
    updateObject.set('time', new Date())
    updateObject.set('content', content)
    updateObject.save(null, {
      success: function(object) {
        alert('留言成功')
        window.location.href = window.location.href
      },
      error: function(model, error) {
        console.error(error)
        alert('提交评论失败,请重试')
      }
    })
  })
})

function fillComment(comment) {
  var imgBaseUrl = 'http://www.gravatar.com/avatar/'
  var t = $(
    '<li><div class="info"><img class="head" src=""><a class="name"></a><div class="date"><span></span></div></div><div class="text"></div></li>'
  )
  if (comment.get('email') != '') {
    imgBaseUrl += md5(comment.get('email'))
  }
  t.find('.head').attr('src', imgBaseUrl)
  t.find('.name').text(comment.get('nickName'))
  t.find('.date span').text(comment.get('time').substr(0, 10))
  t.find('.text').text(comment.get('content'))
  $('#comment-div>ul').append(t)
}
