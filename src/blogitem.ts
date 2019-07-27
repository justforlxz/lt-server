import Extra from './extra'

export default class BlogItem extends Object {
  Header: string = ''
  Link: string = ''
  Description: string = ''
  Extra?: Extra
  Images: string = ''
  Id: string = ''
}
