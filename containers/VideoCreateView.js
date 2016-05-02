import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../actions/Facebook'
import Create from '../components/Create'
import AlbumList from '../components/album_list'
import * as message from '../constants/messages'
import Login from '../containers/Login'
import FacebookHelper  from '../utils/facebook'
import { URL_PREFIX } from '../constants/project'


class VideoCreate extends Component {

	constructor(props){
		super(props);
		this.state = {'selected_album': null}
	}

	componentWillMount(){
    const {albums, history} = this.props
    let facebook_helper = new FacebookHelper()
    facebook_helper.getLoginStatus(function(response){
      if(response.status != "connected" || albums.isLoggedIn != true){
        history.pushState(null, URL_PREFIX+'login')
      }
    })
  }

  componentWillUnmount(){
    localStorage['picovico'] = JSON.stringify(this.props.albums)
  }

  	album_selection_error(){
  		var selection_error;
  		if(this.props.albums.frontend.album_selection_error){
  			selection_error = <p>{message.ALBUM_SELECTION_ERROR}</p>
  			return selection_error
  		}
  	}

  
  	minimum_photo_error(){
  		var photo_error;
  		if(this.props.albums.frontend.minimum_photo_error){
  			photo_error = <div className={"container"}>
  							         <div className={"alert alert-danger"}>
  								        <a href={"#"} className={"close"} data-dismiss={"alert"} aria-label={"close"}>&times;</a>
  								        <strong>Error!</strong> {message.MINIMUM_PHOTO_ERROR}
							         </div>
						          </div>
  			return photo_error
  		}
  	}

    display_popup_content(){
      if(this.props.albums.frontend.preparing_create_video){
        var popup_content = <div className={"modal-body"}>
                                  <h3>Preparing</h3>
                                  <div className={"progress"}>
                                    <div className={"progress-bar progress-bar-striped active"} role={"progressbar"} style={{width: '15%'}}>
                                    </div>
                                  </div>
                                </div>
        return popup_content
      }

      if(this.props.albums.frontend.start_add_photo){
        var photo_percentage = this.props.albums.frontend.photo_percentage
        if(photo_percentage){
          var upload_data = ((photo_percentage / 2) + 15).toFixed()
          var upload_percentage = upload_data.toString() + '%'
        }else{
          var upload_percentage = '16%'
        }

        var popup_content = <div className={"modal-body"}>
                                  <h3>Fetching photos..</h3>
                                  <div className={"progress"}>
                                    <div className={"progress-bar progress-bar-striped active"} role={"progressbar"} style={{width: upload_percentage}}></div>
                                  </div>
                                  <p>Uploading {this.props.albums.frontend.photo_count} of {this.props.albums.frontend.total_photo}</p>
                               </div>
        return popup_content
      }
      if(this.props.albums.frontend.finalize_create_video){
        if(this.props.albums.frontend.finalize_progress){
          var finalize_progress = this.props.albums.frontend.finalize_progress.toString() + '%'
        }else{
          var finalize_progress = '65%'
        }

        var popup_content = <div className={"modal-body"}>
                                  <h3>Creating Your Video</h3>
                                  <div className={"progress"}>
                                    <div className={"progress-bar progress-bar-striped active"} role={"progressbar"} style={{width: finalize_progress}}>
                                    </div>
                                  </div>
                                </div>
        return popup_content
      }
    }

    creating_video_message(){
      var creating_video;
      if(this.props.albums.frontend.creating_video){
        creating_video = <div className={"sharing-video"}>
                          <div className={"modal show"} data-backdrop={"static"} data-keyboard={"false"}>
                            <div className={"modal-dialog"}>
                              <div className={"modal-content"}>
                               {this.display_popup_content()}
                              </div>
                            </div>
                          </div>
                          <div className={"modal-backdrop fade in"}></div>
                        </div>
        return creating_video
      }
    }

    handleClick(){
      const {actions} = this.props
      actions.complete_share()
    }

    handleShare(video){
      const {actions, history} = this.props
      actions.handle_share(video, history)
      // actions.complete_share()
    }

    share_video_popup(){
      var share_video;
      if(this.props.albums.frontend.share_video){
        var last_video_id = this.props.albums.frontend.last_video_created
        var last_video = this.props.albums.user_videos.videos.filter(video => video.id===last_video_id)[0]
        var available_quality = Object.keys(last_video.video)[0]
        var last_video_url = last_video.video[available_quality]['url']

        share_video = <div>
                          <div className={"modal show"} data-backdrop={"static"} data-keyboard={"false"}>
                            <div className={"modal-dialog modal-lg"}>
                              <div className={"modal-content"}>
                                <div className={"modal-body"}>
                                  <button type={"button"} className={"close"} data-dismiss={"modal"} onClick={this.handleClick.bind(this)}>&times;</button>
                                  <h3>MY VIDEO</h3>
                                  <div align={"center"} className={"embed-responsive embed-responsive-16by9"}>
                                  <video width="500" controls>
                                    <source src={last_video_url} type="video/mp4" />
                                    Your browser does not support HTML5 video.
                                  </video>
                                  </div>
                                  <div className={"share-msg"}>
                                  <h4>Like the video? Share it with your friends!</h4>
                                  </div>
                                  <button type={"button"} className={"btn btn-danger share-btn center-block"} onClick={this.handleShare.bind(this, last_video_url)}>SHARE ON FACEBOOK</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"modal-backdrop fade in"}></div>
                          {this.sharing_video_popup()}
                        </div>
        return share_video
      }
    }

    sharing_video_popup(){
      var sharing_video;
      if(this.props.albums.frontend.start_share_video){
        sharing_video = <div>
                          <div className={"modal show sharing-video"} data-backdrop={"static"} data-keyboard={"false"}>
                            <div className={"modal-dialog"}>
                              <div className={"modal-content"}>
                                <div className={"modal-body"}>
                                  <h3>Sharing your video ...</h3>
                                  <div className={"progress"}>
                                    <div className={"progress-bar progress-bar-striped active"} role={"progressbar"} style={{width: '100%'}}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"modal-backdrop fade in sharing-overlay"}></div>
                        </div>
        return sharing_video
      }

    }

  	onUpdate(id){
  		this.setState({'selected_album': id})
  	}

  	render() {
		const {albums, actions, history} = this.props
    if(albums.isLoggedIn){
      return (
      <div>
        {this.creating_video_message()}
        {this.share_video_popup()}
        <AlbumList albums={albums} actions={actions} history={history}/>
      </div>
      )
    }else{
      return (
          <div>
            <Login login={albums} actions={actions} history={history}/>
          </div>
      )
    }	
  }
}

export default VideoCreate

VideoCreate.propTypes = {
  albums: PropTypes.object,
  actions: PropTypes.object.isRequired,

}

function mapStateToProps(state) {
	return {
		albums: state.picovico
	}
}

function mapDispatchToProps(dispatch) {
  	return {
		actions: bindActionCreators(Actions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCreate)
