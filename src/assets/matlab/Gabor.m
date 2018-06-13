classdef Gabor < handle
    % Contains static methods for discrete Gabor analysis.
   
    %%%%%%%%%%%%%%%%
    % Math methods %
    %%%%%%%%%%%%%%%%
   
    methods (Static) 
        
        function g = gaussian1(a, b, tc, t)
            % Calculates a vector from a Gaussian function evaluated at
            % all points in the vector t.
            %
            % The resulting vector is equivalent to the evaluation of
            %   g(t) = a * exp(-b^2 * (t-tc).^2)
            % 
            % Params:
            % - number a    max height of the Gaussian
            % - number b    width/variance of the Gaussian
            % - number tc   center of the Gaussian
            % - vector t    any vector containing time samples
            %
            % Returns:
            % - vector g    the output vector
            
            if a <= 0
                error('a has to be a real value bigger than 0.');
            end
            
            gauss = @(t) a * exp(-b^2 * (t-tc).^2);
            g = gauss(t);
 
        end
        
        function g = gaussian2(a, b, c, xc, yc, theta, x, y)
            % Calculates a matrix from a Gaussian function evaluated at
            % all points in the meshgrid matrices x, y.
            %
            % The resulting vector is equivalent to
            %   g(x, y) = a * exp(-b^2*x'.^2 - c^2*y'.^2)
            % where 
            %   x' = + (x-xc)cos(theta) + (y-yc)sin(theta)
            %   y' = - (x-xc)sin(theta) + (y-yc)cos(theta)
            %
            % Params:
            % - number a        max height of the Gaussian
            % - number b        width/variance of the Gaussian in x
            % - number c        width/variance of the Gaussian in y
            % - number xc       center of the Gaussian in x
            % - number yc       center of the Gaussian in y
            % - number theta    rotation angle of the Gaussian
            % - vector x        any matrix containing meshgrid samples
            % - vector y        any matrix containing meshgrid samples
            %
            % Returns:
            % - matrix g        the output matrix
            
            if a <= 0
                error('a has to be a real value bigger than 0.');
            end
                        
            gauss = @(x, y) a * exp(...
                -b^2 * (+(x-xc)*cos(theta) + (y-yc)*sin(theta)).^2 ...
                -c^2 * (-(x-xc)*sin(theta) + (y-yc)*cos(theta)).^2 ...
            );
            g = gauss(x, y);
 
        end
                
        function fTilde = fgt1(f, g)           
            % Calculates the one-dimensional fast Gabor transform of a 
            % vector.
            %
            % The length of the vectors y and g have to coincide.
            %
            % The returning matrix is fTilde(j, m), where j is time
            % and m is frequency.
            %
            % Params:
            % - vector f        any complex input vector
            % - vector g        evaluated Gaussian function
            %
            % Returns:
            % - matrix fTilde   the complex output matrix
    
            % Determine dimension of input vectors
            [n1, n2] = size(f);
            [n3, n4] = size(g);
            n = max(size(f));

            % Transpose if y is 1xn vector
            if n1 == 1
                f = f.';
            end
            
            % Transpose if g is 1xn vector
            if n3 == 1
                g = g.';
            end
            
            % Show error if necessary
            if max([n1, n2]) ~= max([n3, n4])
               error("Length of vectors y and g must coincide.");
            end
            if norm(g, 2) == 0
                error("The Gaussian function g must not be 0.");
            end
        
            % Setup matrix
            fTilde = zeros(n,n);

            % Initial indices
            tInd = 0:n-1;
            
            % Loop through all times
            for j = 0:n-1
                
                % Calculate the time shift modulo n
                tShift = mod(tInd - j, n) + 1;
                
                % Define phi(k) = y(k)*g(k-j)
                phi = f .* g(tShift);
                
                % For each moment in time, calculate the FFT
                fTilde(j+1, :) = Fourier.fft(phi);
                
            end
            
        end

        function f = ifgt1(fTilde, g)
            % Calculates the one-dimensional inverse fast Gabor transform 
            % of a square matrix.
            %
            % The size of fTilde and g have to coincide.
            %
            % The returning vector is f(j), where j is time.
            %
            % Params:
            % - matrix fTilde   any complex input square matrix
            % - vector g        evaluated Gaussian function
            %
            % Returns:
            % - vector y        the complex output vector 
            
            % Determine dimension of input vectors
            [n1, n2] = size(fTilde);
            [n3, n4] = size(g);
            n = max(size(fTilde));
            
            % Transpose if g is 1xn vector
            if n3 == 1
                g = g.';
            end
            
            % Show error if necessary
            if abs(n1-n2) > 0 || max([n1, n2]) ~= max([n3, n4])
               error("Length of y and g must coincide.");
            end
            if norm(g, 2) == 0
                error("The Gaussian function g must not be 0.");
            end
            
            % Setup resulting vector
            f = zeros(n, 1);

            % Initial indices
            tInd = 0:n-1;

            % Loop through all time samples (of the integral)
            for j = 0:n-1
                
                % Calculate the time shift modulo n
                tShift = mod(tInd - j, n) + 1;
                
                % Get the frequency information of the current time
                phiHat = fTilde(j+1, :).';
                
                % Calculate the IFFT of that vector
                phi = Fourier.ifft(phiHat);
                
                % Sum 
                f = f + g(tShift) .* phi;
                
            end        

            % Make sure the resulting vector is normed properly
            f = 1/norm(g, 2).^2 * f;
    
        end
        
        function gw = filter2(a, b, c, xc, yc, theta, omega, nu, x, y)    
            % Calculates a matrix with values of a Gabor filter evaluated
            % at all points in the meshgrid matrices x, y.
            %
            % Params:
            % - number a        max height of the Gaussian
            % - number b        width/variance of the Gaussian in x
            % - number c        width/variance of the Gaussian in y
            % - number xc       center of the Gaussian in x
            % - number yc       center of the Gaussian in y
            % - number theta    rotation angle of the Gaussian
            % - number omega    
            % - number nu       
            % - vector x        any matrix containing meshgrid samples
            % - vector y        any matrix containing meshgrid samples
            %
            % Returns:
            % - matrix g        the output matrix
            
            if a <= 0
                error('a has to be a real value bigger than 0.');
            end
            
            g1 = Gabor.gaussian2(a, b, c, xc, yc, theta, x, y);
            g2 = exp(1i*omega*(x-xc) + 1i*nu*(y-yc));
            gw = g1 .* g2;
            
        end
        
        function gw = normalizedFilter2(a, b, c, x0, y0, theta, w0, w1, x, y)
            
            % Calculate the matrix of the filter without normalization
            gw = Gabor.filter2(a, b, c, x0, y0, theta, w0, w1, x, y);
            
            % Normalize both real and imaginary part
            gwReal = real(gw);
            gwImag = imag(gw);
            
            % Find the indices with positive and negative values
            gwRealPosInd = find(gwReal > 0);
            gwRealNegInd = find(gwReal < 0);
            gwImagPosInd = find(gwImag > 0);
            gwImagNegInd = find(gwImag < 0);
            
            % Get the averages
            gwRealPosFact = sum(gwReal(gwRealPosInd));
            gwRealNegFact = abs(sum(gwReal(gwRealNegInd)));
            gwImagPosFact = sum(gwImag(gwImagPosInd));
            gwImagNegFact = abs(sum(gwImag(gwImagNegInd)));
            sumReal = (gwRealPosFact + gwRealNegFact)/2;
            sumImag = (gwImagPosFact + gwImagNegFact)/2;
            
            if (sumReal > 0)
                gwRealPosFact = gwRealPosFact / sumReal;
                gwRealNegFact = gwRealNegFact / sumReal;
            end
            if (sumImag > 0)
                gwImagPosFact = gwImagPosFact / sumImag;
                gwImagNegFact = gwImagNegFact / sumImag;
            end
            
            % Set the new values
            gwReal(gwRealPosInd) = gwRealNegFact * gwReal(gwRealPosInd);
            gwReal(gwRealNegInd) = gwRealPosFact * gwReal(gwRealNegInd);
            gwImag(gwImagPosInd) = gwImagNegFact * gwImag(gwImagPosInd);
            gwImag(gwImagNegInd) = gwImagPosFact * gwImag(gwImagNegInd);

            % Put back the results
            gw = gwReal + 1i * gwImag;
     
        end
        
        function fStar = fgc2(f, gw)           
            % Calculates the convolution of an input matrix and a Gabor
            % filter.
            %
            % The size of the matrices y and gw have to coincide.
            %
            % Params:
            % - matrix y        any complex input square matrix
            % - matrix gw       evaluated Gabor filter function
            %
            % Returns:
            % - matrix yTilde   the complex output matrix
    
            % Determine dimension of input vectors
            [n1, n2] = size(f);
            [n3, n4] = size(gw);
            
            % Show error if necessary
            if abs(n1-n2) > 0 || abs(n3-n4) > 0 || abs(n1-n3) > 0
               error("Matrices y and filter must be square and coincide in size.");
            end
            
            fStar = Fourier.conv(f, gw);
            
        end
                
        function A = translate(A, hShift, vShift)
            % Shifts any matrix.
            %
            % Params:
            % - matrix A        any complex input matrix
            % - number hShift   amount of indices to shift horizontally
            % - number vShift   amount of indices to shift vertically
            %
            % Returns:
            % - matrix A        the complex output matrix
            
            A = circshift(A, [vShift, hShift]);
            
        end
        
    end
    
    methods (Static, Access = private)   
    end
    
    %%%%%%%%%%%%%%%%
    % Test methods %
    %%%%%%%%%%%%%%%%
    
    methods (Static)
                   
        function test()
            % Tests the functionality of the class and prints the result.
            
            % Setup test variables
            tol = 10^(-9);
            amount = 5;
                         
            fprintf('========================================\n\n');
            fprintf('Starting Gabor class test...\n\n');
            fprintf('- Error tolerance: %d\n', tol);
            fprintf('- Tests per method: %d\n', amount);
            fprintf('\n');
            
            % Test Gaussian1
            fprintf('----------\nTesting Gaussian1:\n');
            for k=1:amount
                Gabor.gaussian1Test();
            end
            
            % Test Gaussian2
            fprintf('----------\nTesting Gaussian2:\n');
            for k=1:amount
                Gabor.gaussian2Test();
            end
            
            % Test FGT  
            fprintf('----------\nTesting FGT:\n');
            for k=1:amount
                Gabor.fgtTest(tol);
            end
            
            % Test FGT/IFGT  
            fprintf('----------\nTesting FGT&IFGT:\n');
            for k=1:amount
                Gabor.fgtifgtTest(tol);
            end
            
            % Test NormalizedFilter
            fprintf('----------\nTesting NormalizedFilter2:\n');
            for k=1:amount
                Gabor.normalizedfilter2test(tol);
            end
            
            fprintf('----------\nTesting completed with 0 issues.\n');
            
        end
        
    end
    
    methods (Static, Access = private)    
        
        function gaussian1Test()
            
            tol = 100000;
            
            a = Gabor.randr(1, 1);
            b = Gabor.randr(1, 1);
            tc = Gabor.randr(1, 1);
            t = linspace(0, 100, tol);
            
            g = Gabor.gaussian1(a, b, tc, t);
            
            [j, ~] = min(g);
            [l, m] = max(g);
            
            if (j < 0 || l > a)
                fprintf('[ ] Gaussian a=%d, b=%d, tc=%d.\n', a, b, tc);
                error('Error with parameter a.');
            end

            if (abs(t(m)-tc) > 100/tol)
                fprintf('[ ] Gaussian a=%d, b=%d, tc=%d.\n', a, b, tc);
                error('Error with parameter tc.');
            end
            
            fprintf('[X] Gaussian a=%d, b=%d, tc=%d.\n', a, b, tc);
            
        end
        
        function gaussian2Test()
            
            tol = 1000;
            
            a = Gabor.randr(1, 1);
            b = 0.5+randi(10);
            c = 0.5+randi(10);
            xc = Gabor.randr(1, 1);
            yc = Gabor.randr(1, 1);
            theta = Gabor.randr(1, 1);
            [x, y] = meshgrid(linspace(0, 100, tol+1), linspace(0, 100, tol+1));
            
            g = Gabor.gaussian2(a, b, c, xc, yc, theta, x, y);
            
            j = min(min(g));
            maximum = max(max(g));
            [l, m] = find(g == maximum);
            
            if (j < 0 || maximum > a)
                fprintf('[ ] Gaussian a=%d, b=%d, c=%d, xc=%d, yc=%d, theta=%d.\n', a, b, c, xc, yc, theta);
                error('Error with parameter a.');
            end

            if (abs(x(l,m)-xc) > 2*100/tol)
                fprintf('[ ] Gaussian a=%d, b=%d, c=%d, xc=%d, yc=%d, theta=%d.\n', a, b, c, xc, yc, theta);
                error('Error with parameter xc.');
            end

            if (abs(y(l,m)-yc) > 2*100/tol)
                fprintf('[ ] Gaussian a=%d, b=%d, c=%d, xc=%d, yc=%d, theta=%d.\n', a, b, c, xc, yc, theta);
                error('Error with parameter yc.');
            end
            
            fprintf('[X] Gaussian a=%d, b=%d, c=%d, xc=%d, yc=%d, theta=%d.\n', a, b, c, xc, yc, theta);
            
        end
                
        function fgtTest(tol)
            t = (1:1:2^8)';
            y = Gabor.randc(2^8, 1);
            g = Gabor.gaussian1(1, 0, 0, t);
            yTilde = Gabor.fgt1(y, g);
            diff = max(abs(yTilde(1, :).' - Fourier.fft(y)));
            Gabor.printTestResult(diff, tol);
        end
        
        function fgtifgtTest(tol)
            t = (1:1:2^8)';
            y = Gabor.randc(2^8, 1);
            g = Gabor.gaussian1(Gabor.randr(1, 1), Gabor.randr(1, 1), (2^8)/2, t);
            diff = max(abs(Gabor.ifgt1(Gabor.fgt1(y, g), g) - y));
            Gabor.printTestResult(diff, tol);
        end
        
        function normalizedfilter2test(tol)
            
            h = 1000;
            
            a = Gabor.randr(1, 1);
            b = Gabor.randr(1, 1);
            c = Gabor.randr(1, 1);
            xc = Gabor.randr(1, 1);
            yc = Gabor.randr(1, 1);
            theta = Gabor.randr(1, 1);
            w0 = Gabor.randr(1, 1);
            w1 = Gabor.randr(1, 1);
            [x, y] = meshgrid(linspace(0, 100, h), linspace(0, 100, h));
            
            gwc = Gabor.normalizedFilter2(a, b, c, xc, yc, theta, w0, w1, x, y);
            
            diff = sum(sum(real(gwc))) + sum(sum(imag(gwc)));
            
            if (diff > tol)
                fprintf('[ ] Normalization error: %d\n', diff);
                error('Error too high or tolerance too low.');
            else
                fprintf('[X] Normalization error: %d\n', diff);
            end
            
        end
        
        function y = randr(m, n)
            y = randi(100, m, n) .* rand(m, n);
        end
        
        function y = randc(m, n)
            y = randi(100, m, n) .* rand(m, n) + 1i * randi(100, m, n) .* rand(m, n);
        end
        
        function printTestResult(diff, tol)
            if (diff > tol)
                fprintf('[ ] Calculation error: %d\n', diff);
                error('Error too high or tolerance too low.');
            else
                fprintf('[X] Calculation error: %d\n', diff);
            end
        end
        
    end
    
end