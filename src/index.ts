var express = require('express')
var app = express()

import * as cheerio from 'cheerio'

import Extra from './extra'
import BlogItem from './blogitem'

function removeSpace(source: string) {
  return source.replace(/\ +/g, '')
}

function removeReturn(source: string) {
  return source.replace(/[\r\n]/g, '')
}

function textHandle(source: string) {
  return removeSpace(removeReturn(source))
}

function header(item: any) {
  item
    .find('.header')
    .find('div')
    .remove()
  return textHandle(
    item
      .find('.header')
      .not('div')
      .text()
  )
}

function link(item: any) {
  return textHandle(item.find('.header').attr('href'))
}

function description(item: any) {
  return textHandle(
    item
      .find('.description')
      .find('p')
      .text()
  )
}

function extra(item: any) {
  let extra = new Extra()
  let Item = item.find('.item')
  extra.Url = Item.eq(0)
    .find('a')
    .attr('href')
  extra.Time = Item.eq(1).text()
  extra.Eye = Item.eq(2).text()
  extra.Comments = Item.eq(3)
    .find('a')
    .text()
  extra.CommentsUrl = Item.eq(3)
    .find('a')
    .attr('href')

  return extra
}

function images(item: any) {
  return item
    .find('.images')
    .find('img')
    .attr('src')
}

function getCurrentPage(index: number) {
  const cheerio = require('cheerio')
  const request = require('sync-request')
  const fs = require('fs')
  const baseUrl =
    'https://my.oschina.net/xxiaobian/widgets/_space_index_newest_blog?catalogId=0&q=&p=' +
    index +
    '&type=ajax'
  const html = request('GET', baseUrl)
    .getBody()
    .toString()
  const $ = cheerio.load(html)
  const blogList = $('.blog-item')

  let array = []
  for (var i = 0; i < blogList.length; i++) {
    const item = blogList.eq(i)
    let blogItem = new BlogItem()
    blogItem.Header = header(item)
    blogItem.Link = link(item)
    blogItem.Description = description(item)
    blogItem.Extra = extra(item)
    blogItem.Images = images(item)
    blogItem.Id = item.attr('data-id')
    array.push(blogItem)
  }

  return array
}

function page(index: number) {
  const request = require('sync-request')
  const fs = require('fs')
  const baseUrl = 'https://my.oschina.net/xxiaobian/blog/' + index
  const html = request('GET', baseUrl)
    .getBody()
    .toString()
  const $ = cheerio.load(html)
  const blogItem = $('#articleContent')
  return blogItem.html()
}

app.get('/json', function(req: any, res: any) {
  if ('page' in req.query) {
    res.send(getCurrentPage(req.query.page))
  }
})

app.get('/html', function(req: any, res: any) {
  if ('detail' in req.query) {
    res.send(page(req.query.detail))
  }
})

var server = app.listen(8081, function() {
  let host = server.address().address
  let port = server.address().port

  console.log('应用实例，访问地址为 http://%s:%s', host, port)
})
