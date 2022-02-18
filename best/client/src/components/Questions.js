import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' 
import { Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import { userAuthenticated } from './utils/userAuthenticated'
import { MultiSelect } from './utils/reactSelect'

const Questions = () => {
  
  const [ searchResults, setSearchResults ] = useState([])
  const { searchTerm } = useParams()
  const [ selected, setSelected ] = useState({
    value: '', 
    label: ''
  })
  const [ appliedFilter, setAppliedFilter ] = useState([])

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios.get(`/api/questions/${searchTerm}`)
        setSearchResults(data)
      } catch (error) {
        console.log(error)
      }
    }
    getQuestions()
  }, [searchTerm])


  return (
    
    <>
      <Container className='mt-3'>
        <Row className='justify-content-md-center m-4'>
          <Col lg='8' className='add-q-container'>
          {userAuthenticated() ?
            <Link to='/questions/add' className='remove-links'>
              <div id='add-q' className='text-center'>
                Click here to add a question
              </div>
            </Link>
          :
            <Link to='/login'>
              <div id='add-q-nologin' className='text-center'>
                Login to add a question
              </div>
            </Link>
          }  
          </Col>
        </Row>
        <Row className='justify-content-md-center m-4'>
            <Col lg='12'>
              <h4 className='text-left'>Search by category</h4>
            </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col lg='7'>
            <MultiSelect {...{ setSelected }} />
          </Col>
        </Row>
        <Row className='justify-content-md-center m-4'>
            <Col lg='12'>
              <h4 className='text-left'>Search result for <span id='search-term'>{searchTerm}</span></h4>
            </Col>
        </Row>
        
        <Row >
        {searchResults && searchResults.map(question => {
          const { _id, questionText, imageUrl, voteCount } = question
          const capitalQ = questionText
              .split(' ')[0]
              .split('')[0]
              .toLocaleUpperCase()
            const joinedQ = questionText.slice(1)
            const parsedQ = capitalQ.concat(joinedQ)
          return (
            
              <Col key={_id} md={6} lg={4}>
                <Link className='links' to={`/question/${_id}`}>
                  <div className='q-container'>
                    <div className='q-image-container'>
                      <img className='q-image' src={imageUrl} alt={parsedQ} />
                      <div className='q-text'>{parsedQ}</div>
                    </div>
                  </div>
                </Link>
              </Col>
              ) 
            }
          )
        }
        </Row>
      </Container>
    
    
    </>
  )

}

export default Questions
