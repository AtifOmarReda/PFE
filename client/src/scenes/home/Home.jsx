import Hero from "./Hero"
import ShoppingList from "./ShoppingList"
import Subscribe from "./Subscribe"

const Home = () => {
    return (
        <div className="Home">
            <Hero />
            <ShoppingList />
            <Subscribe />
        </div>
    )
}

export default Home;