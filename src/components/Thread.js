import React from 'react';
import {Item} from 'semantic-ui-react';
import Attachment from './Attachment';

function Thread({thread}) {
    const isOP = (post) => post.postNumber === thread.originalPost.postNumber;

    return (
        <Item.Group divided>
            {thread.posts.map(post => (
                <Item key={post.postNumber} className={isOP(post) ? 'original-post' : 'post'}>
                    {post.attachment && <Attachment attachment/>}
                    <Item.Content>
                        <Item.Meta>
                            <span className='name'>{post.name}</span>
                            <span className='tripcode'>{post.tripode}</span>
                            {isOP(post) && <span className='subject'>{thread.subject}</span>}
                            <span className='date'>{new Date(Date.parse(post.createdAt)).toLocaleString('en-US')}</span>
                            <span className='post-number'>No. {post.postNumber}</span>
                        </Item.Meta>
                        <div className='body'>{post.body}</div>
                    </Item.Content>
                </Item>
            ))}
        </Item.Group>
    );
}

export default Thread;