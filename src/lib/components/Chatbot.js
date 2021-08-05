import "../assets/styles.scss";
import React, { Component } from "react";
import robotLogo from "../assets/icons/robotIcon.svg";
import askIcon from "../assets/icons/askIcon.svg";
import closeIcon from "../assets/icons/closechat.svg";
import handEmoji from "../assets/icons/handemoji.svg";
import sendIcon from "../assets/icons/sendmessage.svg";
import askIconDisabled from "../assets/icons/askIconDisabled.svg";

import axios from "axios";

export default class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.inputTitle = React.createRef();
    this.bottomRef = React.createRef();
    this.mesRef = React.createRef();

    this.state = {
      question: "",
      questions: [],
      chat: false,
      game: "德州推广1",
      answers: [],
    };
  }

  handleChangeIntent = (e) => {
    this.setState({ question: e.target.value });
  };
  scrollToBottom = () => {
    this.mesRef.current.scrollTop = this.mesRef.current.scrollHeight;
  };
  askBot = (e) => {
    let question = this.state.question;
    let game = this.state.game;
    this.setState((prevState) => ({
      questions: [...prevState.questions, question],
    }));
    this.askAiBot(question, game);
    e.target.value = "";
    this.inputTitle.value = "";
    this.setState({ question: "" });
    this.scrollToBottom();
  };
  askAiBot = async (question, game) => {
    const data = new FormData();
    data.append("question", question);

    const aiResponse = await axios({
      url: `https://aisocket.aipigeon.org/detect/${game}`,
      method: "POST",
      data: data,
    });

    if (aiResponse.status === 200) {
      let answer = aiResponse.data;
      this.setState((prevState) => ({
        answers: [...prevState.answers, answer],
      }));
    }
  };
  keyPress = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      let question = this.state.question;
      this.setState((prevState) => ({
        questions: [...prevState.questions, question],
      }));
      let game = this.state.game;

      this.askAiBot(question, game);
      this.setState({ question: "" });

      this.inputTitle.value = "";
      this.scrollToBottom();

      // put the login here
    }
  };
  handleChooseGame = (game) => {
    this.setState({ game: game });
  };
  render() {
    return (
      <div>
        {
          <div className="circle-chat-container flex fdr aic jcc">
            <div className="lets-talk-chat flex fdr aic jcc">
              <img alt="img" src={handEmoji} />
              我们谈一谈吧
            </div>
            <div
              className="circle-chatbot flex fdc aic jcc"
              onClick={() => this.setState({ chat: !this.state.chat })}
            >
              <img alt="img" src={askIcon} />
            </div>
          </div>
        }
        {this.state.chat && (
          <div className="chat-container flex fdc aic jcc">
            <div className="chatbot">
              <div className="top-cover flex fdr aic jcfs">
                <img alt="img" src={robotLogo} />
                <div className="flex fdc aifs jcc">
                  <h5 className="title">聊天机器人 </h5>
                  <p>线上</p>
                </div>
                <div
                  className="close flex fdr aic jcc"
                  onClick={() => this.setState({ chat: !this.state.chat })}
                >
                  <img alt="close" src={closeIcon} />
                </div>
              </div>
              <div
                className="faq-container flex fdc aifs jcfs"
                ref={this.mesRef}
              >
                <div className="question flex fdr aic jcfs">
                  <img alt="img" src={robotLogo} /> <p>想看我能做什么吗?</p>
                </div>

                {this.state.questions.map((e, i) => {
                  return (
                    <div className="answer flex fdc aife jcc">
                      <p>{e}</p>
                      {this.state.answers.map((e, j) => {
                        if (i === j) {
                          return (
                            <div className="question flex fdc aifs jcc">
                              <p>{e}</p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="ask flex fdr aic jcfs">
                <input
                  ref={(el) => (this.inputTitle = el)}
                  onChange={this.handleChangeIntent}
                  placeholder="在此输入你的问题"
                  onKeyDown={this.keyPress}
                />
                {this.state.question !== "" ? (
                  <button onClick={this.askBot}>
                    <img alt="img" src={sendIcon} />
                  </button>
                ) : (
                  <button className="disabled">
                    <img alt="img" src={askIconDisabled} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
