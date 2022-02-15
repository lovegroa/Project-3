import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' 
import { Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import { userAuthenticated } from './utils/userAuthenticated'

const Questions = () => {
  
  const [ searchResults, setSearchResults ] = useState([])
  const { searchTerm } = useParams()

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
    
      <Container>
        <Row className='justify-content-md-center m-4'>
            <Col lg='8'>
              <h4 className='text-left'>Search result for <span id='search-term'>{searchTerm}</span></h4>
            </Col>
        </Row>
        <Row className='justify-content-md-center m-4'>
          <Col lg='8'>
          {userAuthenticated() ?
            <Link to='/questions/add'>
              <Button className='btn-success button-text'>
                Add a question
              </Button>
            </Link>
          :
            <Link to='/login'>
              <Button className='btn-secondary button-text'>
                Login to add a question
              </Button>
            </Link>
          }  
          </Col>
        </Row>
        {searchResults && searchResults.map(question => {
          const { _id, questionText } = question
          return (
            <Row key={_id} className='justify-content-md-center m-4'>
              <Col lg='8'>
                <Link className='links' to={`/question/${_id}`}>
                  <Button className='btn-outline-secondary btn-q button-text'>
                    {questionText}
                  </Button>
                </Link>
              </Col>
            </Row>
          )
        }
          
        )
        
        
        }
          
      </Container>
    
    
    </>
  )

}

export default Questions
