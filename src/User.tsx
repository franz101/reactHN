import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getSingle } from './actions';
import { renderMarkup, renderLoading } from './helpers';
import { IStoreState, IUser } from './types';

interface MatchParams {
  id: string
}

interface IProps extends IStoreState,
  RouteComponentProps<MatchParams>,
  DispatchProp {
  dispatch: any,
  state: IUser
}

class User extends Component<IProps> {

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(getSingle('user', id));
  }

  getRating = (karma: IProps['state']['karma']) => {
    const length = karma.toString().length;
    if (karma > 100) {
      return { label: 'great', icon: '🔥'.repeat(length) };
    } else if (karma < 0) {
      return { label: 'bad', icon: '💩'.repeat(length - 1) };
    } else if (karma === 0) {
      return { label: 'new', icon: '🆕' };
    }
    return { label: 'good', icon: '👍'.repeat(length) };
  }

  renderRating = (karma: IProps['state']['karma']) => {
    if (!karma) return;
    const rating = this.getRating(karma);
    return (
      <span
        role="img"
        aria-label={`${rating.label} rating`}
        title={rating.label}
      >
        {rating.icon}
      </span>
    );
  }

  renderUser(data: IProps['state']) {
    if (!data || !Object.hasOwnProperty.call(data, 'id')) return;
    return (
      <div className="content">
        <h1 className="single__title">{data.id}</h1>
        <div>
          <strong>Created:</strong>&nbsp;
          {data.created}
        </div>
        <div>
          <strong>Karma:</strong>&nbsp;
          {data.karma} {this.renderRating(data.karma)}
        </div>
        <div dangerouslySetInnerHTML={renderMarkup(data.about)} />
      </div>
    );
  }

  render() {
    const { state, isFetching } = this.props;
    return (
      <div className="container">
        {isFetching ?
          renderLoading() :
          this.renderUser(state)
        }
      </div>
    );
  }
}

const mapStateToProps = (state: any) => state.data;

export default connect<IStoreState>(mapStateToProps)(User);