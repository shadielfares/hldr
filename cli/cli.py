import click
import asyncio
from client.client import live_analyze_client
@click.group()
def cli():
    """HLDR Command Line Interface"""
    pass

@click.command()
def start():
    """Start HLDR analysis"""
    click.echo("Starting HLDR...")

@click.command()
@click.argument('filename', type=click.Path(exists=True))
def check(filename):
    """Check code by sending to WebSocket server"""
    click.echo(f"Checking file: {filename}")
    
    with open(filename, 'r') as file:
        code = file.read()

    # Call the WebSocket client to analyze the code
    asyncio.run(live_analyze_client(code))

cli.add_command(start)
cli.add_command(check)

if __name__ == "__main__":
    cli()
