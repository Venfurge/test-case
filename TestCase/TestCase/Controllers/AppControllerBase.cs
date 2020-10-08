using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TestCase.Exceptions;

namespace TestCase.Controllers
{
    public class AppControllerBase : ControllerBase
    {
        protected async Task<ActionResult<T>> ExecuteWithOkResponse<T>(Func<Task<T>> func)
        {
            try
            {
                return Ok(await func());
            }
            catch (NotFoundException e)
            {
                return NotFound(e.ToString());
            }
            catch (BadRequestException e)
            {
                return BadRequest(e.ToString());
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        protected async Task<ActionResult> ExecuteWithOkResponse(Func<Task> func)
        {
            try
            {
                await func();
                return Ok();
            }
            catch (NotFoundException e)
            {
                return NotFound(e.ToString());
            }
            catch (BadRequestException e)
            {
                return BadRequest(e.ToString());
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}
