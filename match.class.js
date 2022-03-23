class Match{
    constructor(time, meta, teamOne, teamTwo, rating, event){
        this.time = time;
        this.meta = meta;
        this.teamOne = teamOne;
        this.teamTwo = teamTwo;
        this,rating = rating;
        this.event = event;
    }

    getTime(){
        return this.time;
    }
    
    setTime(time){
        this.time = time;
    }
    
    getMeta(){
        return this.meta;
    }
    
    setMeta(meta){
        this.meta = meta;
    }
    
    getTeamOne(){
        return this.teamOne;
    }
    
    setTeamOne(teamOne){
        this.teamOne = teamOne;
    }
    
    getTeamTwo(){
        return this.teamTwo;
    }
    
    setTeamTwo(teamTwo){
        this.teamTwo = teamTwo;
    }
    
    getRating(){
        return this.rating;
    }
    
    setRating(rating){
        this.rating = rating;
    }
    
    getEvent(){
        return this.event;
    }
    
    setEvent(event){
        this.event = event;
    }
}

module.exports = Match;