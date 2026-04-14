from schema import UnderwritingState

def market_context_node(state: UnderwritingState) -> dict:
    """
    Simulates the Market Context Agent.
    Injects real-world Indian macro-economic metrics.
    """
    print("--- 📈 MARKET AGENT: Fetching Macro Context ---")
    
    current_market_context = (
        "Current RBI Repo Rate is 6.50%. "
        "Domestic inflation metrics are stabilizing but core inflation persists. "
        "Sector employment trends in major tech hubs are stabilizing. "
        "Guidance: Apply strict scrutiny to FOIR (Fixed Obligation to Income Ratio) "
        "due to recent RBI tightening on unsecured retail lending guidelines."
    )
    
    return {
        "market_context": current_market_context
    }