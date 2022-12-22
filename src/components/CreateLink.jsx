import { gql, useMutation } from '@apollo/client'
import React, { useState } from 'react'

const CreateLink = () => {
    const [formState, setFormState] = useState({
        description: "",
        url: ""
    })

    const CREATE_LINK_MUTATION = gql`
        mutation PostMutation(
            $description: String! 
            $url: String!
            ){
                post(description: $description, url: $url){
                    id
                    createdAt
                    url
                    description
                }
            }
    `

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            description: formState.description,
            url: formState.url
        }
    })

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                createLink()
            }}>
                <div className='flex flex-column mt3'>
                    <input
                        type="text"
                        value={formState.description}
                        className="mb2"
                        placeholder="A description for the link"
                        onChange={(e) => {
                            setFormState(
                                {
                                    ...formState,
                                    description: e.target.value
                                }
                            )
                        }}
                    />
                    <input
                        type="text"
                        value={formState.url}
                        className="mb2"
                        placeholder="A URL for the link"
                        onChange={(e) => {
                            setFormState(
                                {
                                    ...formState,
                                    url: e.target.value
                                }
                            )
                        }}
                    />

                </div>
                <button type='submit'> Submit</button>
            </form>
        </div>
    )
}

export default CreateLink