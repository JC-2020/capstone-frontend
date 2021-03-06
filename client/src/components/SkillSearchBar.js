import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addSkillToSearchArray, removeSkillFromSearchArray, setAllPossibleSkills } from '../redux/actions';
import SkillSearchOption from './SkillSearchOption';
import { MDBIcon } from 'mdbreact';

export default function SkillSearchBar({category}) {
    const dispatch = useDispatch();
    const [currentSearch, setCurrentSearch] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    
    const pickedSkillsArray = useSelector(state => state.searchSkillsToAdd)
    useEffect(() => {
        //* This is the fetch request to get all available skills from backend
        //* We then dispatch an action to save the skills into the possibleSkills global
        //* state variable
        Axios.get('/api/v1/skills')
            .then(res =>{
                dispatch(setAllPossibleSkills(res.data))
                setSearchOptions(res.data)
            })
            .catch(err =>{
                console.log("Error getting the skills: " + err)
            })

    }, [dispatch])

    const createNewSkill = () => {
        Axios.post(`/api/v1/skills`, {
            name: currentSearch,
            category: category
        })
            .then(res => {
                dispatch(addSkillToSearchArray(res.data))
            })
            .catch(e => {
                console.log(e)
            })
    }

    //* Little regex magic --> basically searches for words that start with the typed in value, not really sure if the [a-zA-Z] part is necessary
    //* we then filter over all of the options and check if the option.name matches the regex expression (if expression evaluates to true then that option is kept)...
    //* if that expression evaluates to false, then it is not included in.
    //* Then it filters based on the category of each skill, we pass the category name in as a prop
    const regex = new RegExp(`\\b${currentSearch.toLowerCase()}[a-zA-Z]*\\b`)
    const filtered = currentSearch ? searchOptions.filter(option => option.name.toLowerCase().match(regex) && option.category === category)  : [];
    const filteredForAlreadyPicked = filtered.filter(option => !pickedSkillsArray.find(skill => skill.name === option.name))

    //todo if the skill they are searching for doesn't exits, then we display a button or something to add a new skill

    return (
        <>
            <div className="input-group md-form form-sm form-1 pl-0">
                
                <div className="input-group-prepend">
                    <span className="input-group-text" color="#01a0dd" id="basic-text1">
                        <MDBIcon className="text-white" icon="search" />
                    </span>
                </div>
                <input className="form-control my-0 py-1" type="text" value={currentSearch} onChange={(e) => {setCurrentSearch(e.target.value)}} placeholder="Start typing to see options" aria-label="Search"  />
            </div>
            <div>
                {filteredForAlreadyPicked.map((option) => {
                    return <SkillSearchOption key={option.id} option={option}/>
                })}
                {filteredForAlreadyPicked.length === 0 && currentSearch.length > 0 ? (
                <button className="new-skill-button" type="button" onClick={createNewSkill}>Create New One</button>
                ):('')}
            </div>

            <div className="form-group">
                {pickedSkillsArray.filter(skill => skill.category === category).map(addedSkill => {
                    return (   
                        <span className="skill-remove-button" key={addedSkill.id}>
                            {addedSkill.name}
                            <button className="remove-skill-button" type="button" onClick={() => {dispatch(removeSkillFromSearchArray(addedSkill.id))}}><MDBIcon far icon="trash-alt red-text" /></button>
                        </span>
                    ) 
                })}
            </div>

        </>
    )
}
