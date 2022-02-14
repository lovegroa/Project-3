import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom' 
import { Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'

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

  // const removeBtnClass = () => {
  //   const element = 
  //   questions && doc
  // }
  

  

  return (
    
    <>
      <Container>
        <Row className='justify-content-md-center m-4'>
          <Col lg='8'>
          
            <Button className='btn-success button-text'>
              Add new question placeholder (if logged-in otherwise sign-in if you want to add a Q)
              {/* <Card className='p-2 bg-success text-white'>
                
                
                
              </Card> */}
            </Button>
          </Col>
        </Row>
        {searchResults && searchResults.map(question => {
          const { _id, questionText } = question
          return (
            <Row key={_id} className='justify-content-md-center m-4'>
              <Col lg='8'>
                <Button className='btn-outline-secondary btn-q button-text'>
                  {questionText}
                </Button>
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
